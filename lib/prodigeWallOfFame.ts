import type { ProdigeArenaView } from "./prodigeArenaSchedule"
import { isProdigeLeagueBanned } from "./prodigeArenaResults"

/** Overall places that share the wall with arena winners. */
const PODIUM_RANK = 3

export type WallOfFameTier = "legend" | "champion" | "elite"

export type WallOfFameInductee = {
  username: string
  points: number
  wins: number
  arenas: number
  best: number
  /** Place in the eligible overall standings. Ties share a rank. */
  rank: number
  /** Arena days this player finished first. */
  arenaWins: number[]
  tier: WallOfFameTier
}

type Acc = {
  username: string
  sourceDay: number
  points: number
  wins: number
  arenas: number
  best: number
  arenaWins: number[]
}

function tierOf(rank: number, arenaWins: number): WallOfFameTier {
  if (rank === 1) return "legend"
  if (arenaWins > 0) return "champion"
  return "elite"
}

/**
 * Players who have won a finished arena, or who sit on the overall podium.
 * Banned accounts are left out, matching the top 16.
 */
export function selectWallOfFame(
  views: ProdigeArenaView[],
): WallOfFameInductee[] {
  const byUser = new Map<string, Acc>()

  for (const view of [...views].sort((a, b) => a.day - b.day)) {
    for (const player of view.players) {
      const key = player.username.toLowerCase()
      if (isProdigeLeagueBanned(key)) continue

      const row = byUser.get(key) ?? {
        username: player.username,
        sourceDay: view.day,
        points: 0,
        wins: 0,
        arenas: 0,
        best: 0,
        arenaWins: [],
      }
      if (view.day >= row.sourceDay) {
        row.username = player.username
        row.sourceDay = view.day
      }
      row.points += player.points
      row.wins += player.wins
      row.arenas += 1
      row.best = Math.max(row.best, player.points)
      if (player.place === 1) row.arenaWins.push(view.day)
      byUser.set(key, row)
    }
  }

  const sorted = [...byUser.values()].sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points
    if (a.arenas !== b.arenas) return b.arenas - a.arenas
    return a.username.localeCompare(b.username, "fr", { sensitivity: "base" })
  })

  let rank = 0
  let previous: number | null = null
  const ranked = sorted.map((row, index) => {
    if (previous !== row.points) {
      rank = index + 1
      previous = row.points
    }
    return { row, rank }
  })

  return ranked
    .filter(
      ({ row, rank: place }) =>
        row.arenaWins.length > 0 || place <= PODIUM_RANK,
    )
    .map(({ row, rank: place }) => ({
      username: row.username,
      points: row.points,
      wins: row.wins,
      arenas: row.arenas,
      best: row.best,
      rank: place,
      arenaWins: row.arenaWins,
      tier: tierOf(place, row.arenaWins.length),
    }))
}
