import { isClosedChesscomAccount, fetchPlayerSnapshotFresh } from "@/lib/chesscom"
import { normalizeChesscomUsername, getSubmittedUsernames } from "@/lib/chesscomUsernames"
import { calendarDate } from "@/lib/eloGains"
import { mergeFollowedUsernames } from "@/lib/trackedPlayers"
import { latestAccountStatuses, saveDailySnapshot } from "@/server/eloSnapshots"

const FETCH_CONCURRENCY = 8

export type EloSnapshotRun = {
  date: string
  followed: number
  saved: number
  skippedClosed: number
  markedClosed: number
  failed: number
}

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index])
    }
  }
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker(),
  )
  await Promise.all(workers)
  return results
}

/**
 * Save today's blitz and rapid ratings for every homepage player whose
 * Chess.com account is still open. Known closed accounts are not requested.
 */
export async function runEloSnapshotCron(
  now: Date = new Date(),
): Promise<EloSnapshotRun> {
  const date = calendarDate(now)
  const usernames = mergeFollowedUsernames(await getSubmittedUsernames())
  const statuses = await latestAccountStatuses(usernames)
  const summary: EloSnapshotRun = {
    date,
    followed: usernames.length,
    saved: 0,
    skippedClosed: 0,
    markedClosed: 0,
    failed: 0,
  }

  await mapWithConcurrency(usernames, FETCH_CONCURRENCY, async (username) => {
    const key = normalizeChesscomUsername(username) ?? username
    if (isClosedChesscomAccount(statuses.get(key) ?? statuses.get(username))) {
      summary.skippedClosed += 1
      return
    }

    try {
      const snap = await fetchPlayerSnapshotFresh(key)
      const accountStatus = snap.accountStatus
      const storedName = normalizeChesscomUsername(snap.username) ?? key

      if (isClosedChesscomAccount(accountStatus)) {
        await saveDailySnapshot({
          username: storedName,
          date,
          blitz: null,
          rapid: null,
          accountStatus,
        })
        summary.markedClosed += 1
        return
      }

      if (snap.error) {
        summary.failed += 1
        return
      }

      await saveDailySnapshot({
        username: storedName,
        date,
        blitz: snap.blitz,
        rapid: snap.rapid,
        accountStatus,
      })
      summary.saved += 1
    } catch {
      summary.failed += 1
    }
  })

  return summary
}
