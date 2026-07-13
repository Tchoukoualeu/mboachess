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

/** How many Chess.com lookups run at once. */
const FETCH_CONCURRENCY = 6
/** How long a computed snapshot is reused before refetching (ms). */
const CACHE_TTL_MS = 60_000

let cache: { key: string; at: number; data: HomeData } | null = null

export const loadHomeData = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeData> => {
    const fromDb = await getSubmittedUsernames()
    const usernames = uniqueSortedUsernames(TRACKED_USERNAMES, fromDb)
    const key = usernames.join(",")
    const now = Date.now()

    if (cache && cache.key === key && now - cache.at < CACHE_TTL_MS) {
      return cache.data
    }

    const rows = await mapWithConcurrency(
      usernames,
      FETCH_CONCURRENCY,
      fetchPlayerSnapshot,
    )
    sortByRapidDesc(rows)

    const data: HomeData = {
      rows,
      blitzLeader: topByRating(rows, "blitz"),
      rapidLeader: topByRating(rows, "rapid"),
    }
    cache = { key, at: now, data }
    return data
  },
)
