import { getDb, isMongoConfigured } from "./mongodb"

const COLLECTION = "tournaments"

export type Tournament = {
  _id?: string
  name: string
  startDate: Date
  endDate?: Date
  location?: string
  description?: string
  link?: string
  createdAt: Date
}

export async function getTournaments(): Promise<Tournament[]> {
  if (!isMongoConfigured()) return []
  const db = await getDb()
  if (!db) return []

  const now = new Date()
  const docs = await db
    .collection(COLLECTION)
    .find<Tournament>({
      startDate: { $gte: now },
    })
    .sort({ startDate: 1 })
    .toArray()

  return docs
}

export type SaveTournamentResult = "ok" | "unconfigured" | "invalid"

export async function saveTournament(
  tournament: Omit<Tournament, "_id" | "createdAt">,
): Promise<SaveTournamentResult> {
  if (!tournament.name || !tournament.startDate) return "invalid"
  if (!isMongoConfigured()) return "unconfigured"

  const db = await getDb()
  if (!db) return "unconfigured"

  const col = db.collection(COLLECTION)
  await col.insertOne({
    ...tournament,
    createdAt: new Date(),
  })

  return "ok"
}
