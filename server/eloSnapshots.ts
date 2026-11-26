import type { Db } from "mongodb"
import type { EloSnapshotRow } from "@/lib/eloGains"
import { shiftMonth } from "@/lib/eloGains"
import { getDb } from "@/lib/mongodb"

const COLLECTION = "elo_snapshots"

export type DailySnapshotInput = {
  username: string
  date: string
  blitz: number | null
  rapid: number | null
  accountStatus: string | null
}

type StoredSnapshot = DailySnapshotInput & {
  fetchedAt: Date
}

let indexesReady: Promise<void> | null = null

function ensureIndexes(db: Db): Promise<void> {
  if (!indexesReady) {
    indexesReady = db
      .collection(COLLECTION)
      .createIndex({ username: 1, date: 1 }, { unique: true })
      .then(() => undefined)
      .catch((error: unknown) => {
        indexesReady = null
        throw error
      })
  }
  return indexesReady
}

export async function latestAccountStatuses(
  usernames: readonly string[],
): Promise<Map<string, string | null>> {
  const statuses = new Map<string, string | null>()
  if (usernames.length === 0) return statuses
  const db = await getDb()
  if (!db) return statuses
  await ensureIndexes(db)

  const rows = await db
    .collection<StoredSnapshot>(COLLECTION)
    .aggregate<{ _id: string; accountStatus: string | null }>([
      { $match: { username: { $in: [...usernames] } } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$username",
          accountStatus: { $first: "$accountStatus" },
        },
      },
    ])
    .toArray()

  for (const row of rows) statuses.set(row._id, row.accountStatus ?? null)
  return statuses
}

export async function saveDailySnapshot(input: DailySnapshotInput): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error("Database is not configured")
  await ensureIndexes(db)
  await db.collection<StoredSnapshot>(COLLECTION).updateOne(
    { username: input.username, date: input.date },
    {
      $set: {
        blitz: input.blitz,
        rapid: input.rapid,
        accountStatus: input.accountStatus,
        fetchedAt: new Date(),
      },
      $setOnInsert: {
        username: input.username,
        date: input.date,
      },
    },
    { upsert: true },
  )
}

type BaselineGroup = {
  _id: string
  blitz: { date: string; rating: number } | null
  rapid: { date: string; rating: number } | null
}

/**
 * In-month rows plus one baseline row per player: the last blitz rating and
 * the last rapid rating from before the month.
 */
export async function loadMonthSnapshots(month: string): Promise<EloSnapshotRow[]> {
  const db = await getDb()
  if (!db) return []
  await ensureIndexes(db)

  const start = `${month}-01`
  const end = `${shiftMonth(month, 1)}-01`
  const col = db.collection<StoredSnapshot>(COLLECTION)

  const [inMonth, baselines] = await Promise.all([
    col
      .find({ date: { $gte: start, $lt: end } })
      .project<EloSnapshotRow>({
        _id: 0,
        username: 1,
        date: 1,
        blitz: 1,
        rapid: 1,
      })
      .toArray(),
    col
      .aggregate<BaselineGroup>([
        { $match: { date: { $lt: start } } },
        {
          $group: {
            _id: "$username",
            blitz: {
              $max: {
                $cond: [
                  { $isNumber: "$blitz" },
                  { date: "$date", rating: "$blitz" },
                  null,
                ],
              },
            },
            rapid: {
              $max: {
                $cond: [
                  { $isNumber: "$rapid" },
                  { date: "$date", rating: "$rapid" },
                  null,
                ],
              },
            },
          },
        },
      ])
      .toArray(),
  ])

  const before: EloSnapshotRow[] = []
  for (const row of baselines) {
    if (!row.blitz && !row.rapid) continue
    const date =
      row.blitz && row.rapid
        ? row.blitz.date > row.rapid.date
          ? row.blitz.date
          : row.rapid.date
        : (row.blitz?.date ?? row.rapid?.date ?? start)
    if (date >= start) continue
    before.push({
      username: row._id,
      date,
      blitz: row.blitz?.rating ?? null,
      rapid: row.rapid?.rating ?? null,
    })
  }

  return [...before, ...inMonth]
}
