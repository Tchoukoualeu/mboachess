import { createServerFn } from "@tanstack/react-start"
import { getSubmittedUsernames } from "@/lib/chesscomUsernames"
import {
  type PlayerLookupResult,
  fetchPlayerSnapshot,
} from "@/lib/chesscom"
import { topByRating } from "@/lib/ratingLeaders"

const TRACKED_USERNAMES = [
  "menxele",
  "brlliantmoves",
  "aris2021222324",
  "amicodi1pelato",
  "open2doorwithin",
] as const

function uniqueSortedUsernames(a: readonly string[], b: string[]): string[] {
  return [...new Set([...a, ...b])].sort((x, y) => x.localeCompare(y))
}

function sortByRapidDesc(rows: PlayerLookupResult[]) {
  rows.sort((a, b) => {
    const aNum =
      typeof a.rapid === "number" ? a.rapid : Number.NEGATIVE_INFINITY
    const bNum =
      typeof b.rapid === "number" ? b.rapid : Number.NEGATIVE_INFINITY
    if (bNum !== aNum) return bNum - aNum
    return a.username.localeCompare(b.username, undefined, {
      sensitivity: "base",
    })
  })
}

/**
 * Fetch `fn` for each item with a bounded number of concurrent calls.
 * Keeps input order in the result array.
 */
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
    worker,
  )
  await Promise.all(workers)
  return results
}

type HomeData = {
  rows: PlayerLookupResult[]
  blitzLeader: ReturnType<typeof topByRating>
  rapidLeader: ReturnType<typeof topByRating>
}

/** How many Chess.com lookups run at once on a cold fetch. */
const FETCH_CONCURRENCY = 8
/** How long a cached snapshot is considered fresh before a background refresh. */
const PLAYER_TTL_MS = 60_000

type PlayerCacheEntry = {
  at: number
  data: PlayerLookupResult
  refreshing: boolean
}

const playerCache = new Map<string, PlayerCacheEntry>()

/**
 * Stale-while-revalidate snapshot for a single player.
 *
 * - No cache yet: fetch and block (only happens once per username).
 * - Cached and fresh: return immediately.
 * - Cached and stale: return the stale value now and refresh in the
 *   background so the next request is up to date. This keeps SSR instant
 *   while ratings stay reasonably current.
 */
async function getCachedSnapshot(
  username: string,
): Promise<PlayerLookupResult> {
  const entry = playerCache.get(username)
  const now = Date.now()

  if (!entry) {
    const data = await fetchPlayerSnapshot(username)
    playerCache.set(username, { at: Date.now(), data, refreshing: false })
    return data
  }

  if (now - entry.at >= PLAYER_TTL_MS && !entry.refreshing) {
    entry.refreshing = true
    void fetchPlayerSnapshot(username)
      .then((fresh) => {
        playerCache.set(username, {
          at: Date.now(),
          data: fresh,
          refreshing: false,
        })
      })
      .catch(() => {
        entry.refreshing = false
      })
  }

  return entry.data
}

export const loadHomeData = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeData> => {
    const fromDb = await getSubmittedUsernames()
    const usernames = uniqueSortedUsernames(TRACKED_USERNAMES, fromDb)

    const rows = await mapWithConcurrency(
      usernames,
      FETCH_CONCURRENCY,
      getCachedSnapshot,
    )
    sortByRapidDesc(rows)

    return {
      rows,
      blitzLeader: topByRating(rows, "blitz"),
      rapidLeader: topByRating(rows, "rapid"),
    }
  },
)
