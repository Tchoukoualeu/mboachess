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

export const loadHomeData = createServerFn({ method: "GET" }).handler(
  async () => {
    const fromDb = await getSubmittedUsernames()
    const usernames = uniqueSortedUsernames(TRACKED_USERNAMES, fromDb)
    const rows: PlayerLookupResult[] = []
    for (const u of usernames) {
      rows.push(await fetchPlayerSnapshot(u))
      await new Promise((r) => setTimeout(r, 120))
    }

    sortByRapidDesc(rows)

    return {
      rows,
      blitzLeader: topByRating(rows, "blitz"),
      rapidLeader: topByRating(rows, "rapid"),
    }
  },
)
