import type { ProdigeArenaView } from "./prodigeArenaSchedule"
import { isProdigeLeagueBanned } from "./prodigeArenaResults"

/**
 * Season rewards are derived from finished arenas. Adding an arena to the
 * schedule and storing its games is enough: the next visit recomputes this.
 */

const DECISIVE_LOSSES = new Set(["checkmated", "resigned"])

export const PRODIGE_REWARD_IDS = [
  "wins",
  "giantKiller",
  "upsets",
  "games",
  "attendance",
  "streak",
  "black",
  "podiums",
  "checkmates",
] as const

export type ProdigeRewardId = (typeof PRODIGE_REWARD_IDS)[number]

export type ProdigeRewardGame = {
  url: string
  day: number
  winner: string
  winnerRating: number
  loser: string
  loserRating: number
  margin: number
  color: "white" | "black"
  finish: "checkmated" | "resigned"
}

export type ProdigeRewardRow = {
  username: string
  profileUrl: string
  primary: number
  secondary: number | null
  leader: boolean
  game: ProdigeRewardGame | null
}

export type ProdigeRewardBlock = {
  id: ProdigeRewardId
  rows: ProdigeRewardRow[]
}

export type ProdigeRewardsData = {
  arenaCount: number
  gameCount: number
  rewards: ProdigeRewardBlock[]
}

type Acc = {
  username: string
  profileUrl: string
  sourceDay: number
  wins: number
  games: number
  arenas: Set<number>
  blackWins: number
  blackGames: number
  checkmates: number
  podiums: number
  firsts: number
  upsetWins: number
  upsetMargin: number
  bestStreak: number
  streakDay: number
}

function profileUrl(username: string): string {
  return `https://www.chess.com/member/${encodeURIComponent(username)}`
}

function emptyAcc(username: string, day: number, url: string): Acc {
  return {
    username,
    profileUrl: url,
    sourceDay: day,
    wins: 0,
    games: 0,
    arenas: new Set(),
    blackWins: 0,
    blackGames: 0,
    checkmates: 0,
    podiums: 0,
    firsts: 0,
    upsetWins: 0,
    upsetMargin: 0,
    bestStreak: 0,
    streakDay: 0,
  }
}

function compareName(a: string, b: string): number {
  return a.localeCompare(b, "fr", { sensitivity: "base" })
}

function toRow(
  acc: Acc,
  primary: number,
  secondary: number | null,
  leader: boolean,
): ProdigeRewardRow {
  return {
    username: acc.username,
    profileUrl: acc.profileUrl,
    primary,
    secondary,
    leader,
    game: null,
  }
}

function rankedRows(
  players: Acc[],
  primaryOf: (player: Acc) => number,
  secondaryOf: (player: Acc) => number | null,
  tieBreak: boolean,
  limit: number,
): ProdigeRewardRow[] {
  const ranked = players
    .map((player) => ({
      player,
      primary: primaryOf(player),
      secondary: secondaryOf(player),
    }))
    .filter((row) => row.primary > 0)
    .sort((a, b) => {
      if (a.primary !== b.primary) return b.primary - a.primary
      if (tieBreak && (a.secondary ?? 0) !== (b.secondary ?? 0)) {
        return (b.secondary ?? 0) - (a.secondary ?? 0)
      }
      return compareName(a.player.username, b.player.username)
    })

  if (ranked.length === 0) return []

  const best = ranked[0].primary
  const pool = ranked.filter((row) => row.primary === best)
  const bestSecondary = tieBreak
    ? Math.max(...pool.map((row) => row.secondary ?? 0))
    : null

  const flagged = ranked.map((row) =>
    toRow(
      row.player,
      row.primary,
      row.secondary,
      row.primary === best &&
        (bestSecondary === null || (row.secondary ?? 0) === bestSecondary),
    ),
  )
  const leaderCount = flagged.filter((row) => row.leader).length
  return flagged.slice(0, Math.max(limit, leaderCount))
}

export function computeProdigeRewards(
  views: ProdigeArenaView[],
): ProdigeRewardsData {
  const finished = [...views].sort((a, b) => a.day - b.day)
  const byUser = new Map<string, Acc>()
  const upsets: ProdigeRewardGame[] = []

  const ensure = (username: string, day: number, url?: string): Acc => {
    const key = username.toLowerCase()
    let row = byUser.get(key)
    if (!row) {
      row = emptyAcc(username, day, url ?? profileUrl(username))
      byUser.set(key, row)
      return row
    }
    if (day >= row.sourceDay) {
      row.username = username
      row.sourceDay = day
      if (url) row.profileUrl = url
    }
    return row
  }

  for (const view of finished) {
    for (const player of view.players) {
      const row = ensure(player.username, view.day, player.profileUrl)
      row.arenas.add(view.day)
      if (player.place <= 3) row.podiums += 1
      if (player.place === 1) row.firsts += 1
    }

    const streak = new Map<string, number>()
    for (const game of view.games) {
      const sides = [
        {
          username: game.white,
          rating: game.whiteRating,
          result: game.whiteResult,
          opponent: game.black,
          opponentRating: game.blackRating,
          opponentResult: game.blackResult,
          color: "white" as const,
        },
        {
          username: game.black,
          rating: game.blackRating,
          result: game.blackResult,
          opponent: game.white,
          opponentRating: game.whiteRating,
          opponentResult: game.whiteResult,
          color: "black" as const,
        },
      ]

      for (const side of sides) {
        const row = ensure(side.username, view.day)
        const key = side.username.toLowerCase()
        row.games += 1
        if (side.color === "black") row.blackGames += 1

        if (side.result !== "win") {
          streak.set(key, 0)
          continue
        }

        row.wins += 1
        if (side.color === "black") row.blackWins += 1
        if (side.opponentResult === "checkmated") row.checkmates += 1

        const next = (streak.get(key) ?? 0) + 1
        streak.set(key, next)
        if (next > row.bestStreak) {
          row.bestStreak = next
          row.streakDay = view.day
        }

        if (
          DECISIVE_LOSSES.has(side.opponentResult) &&
          typeof side.rating === "number" &&
          typeof side.opponentRating === "number" &&
          side.opponentRating > side.rating
        ) {
          const margin = side.opponentRating - side.rating
          row.upsetWins += 1
          row.upsetMargin += margin
          if (
            (side.opponentResult === "checkmated" ||
              side.opponentResult === "resigned") &&
            !isProdigeLeagueBanned(side.username)
          ) {
            upsets.push({
              url: game.url,
              day: view.day,
              winner: row.username,
              winnerRating: side.rating,
              loser: side.opponent,
              loserRating: side.opponentRating,
              margin,
              color: side.color,
              finish: side.opponentResult,
            })
          }
        }
      }
    }
  }

  const eligible = [...byUser.values()].filter(
    (player) => !isProdigeLeagueBanned(player.username),
  )

  upsets.sort((a, b) => {
    if (a.margin !== b.margin) return b.margin - a.margin
    if (a.day !== b.day) return a.day - b.day
    return compareName(a.winner, b.winner)
  })

  const bestMargin = upsets[0]?.margin ?? 0
  const leaderGames = upsets.filter((game) => game.margin === bestMargin && bestMargin > 0)
  const giantRows: ProdigeRewardRow[] = upsets
    .slice(0, Math.max(3, leaderGames.length))
    .map((game) => ({
      username: game.winner,
      profileUrl: profileUrl(game.winner),
      primary: game.margin,
      secondary: game.day,
      leader: game.margin === bestMargin && bestMargin > 0,
      game,
    }))

  // Prefer the display name stored on the player record.
  for (const row of giantRows) {
    const known = byUser.get(row.username.toLowerCase())
    if (known) {
      row.username = known.username
      row.profileUrl = known.profileUrl
      if (row.game) row.game.winner = known.username
    }
  }

  const attendance = eligible
    .filter((player) => finished.length > 0 && player.arenas.size === finished.length)
    .sort((a, b) => compareName(a.username, b.username))
    .map((player) => toRow(player, finished.length, null, true))

  const rewards: ProdigeRewardBlock[] = [
    {
      id: "wins",
      rows: rankedRows(eligible, (player) => player.wins, (player) => player.games, false, 5),
    },
    { id: "giantKiller", rows: giantRows },
    {
      id: "upsets",
      rows: rankedRows(
        eligible,
        (player) => player.upsetWins,
        (player) => player.upsetMargin,
        true,
        5,
      ),
    },
    {
      id: "games",
      rows: rankedRows(
        eligible,
        (player) => player.games,
        (player) => player.arenas.size,
        false,
        5,
      ),
    },
    { id: "attendance", rows: attendance },
    {
      id: "streak",
      rows: rankedRows(
        eligible,
        (player) => player.bestStreak,
        (player) => player.streakDay || null,
        false,
        5,
      ),
    },
    {
      id: "black",
      rows: rankedRows(
        eligible,
        (player) => player.blackWins,
        (player) => player.blackGames,
        false,
        5,
      ),
    },
    {
      id: "podiums",
      rows: rankedRows(
        eligible,
        (player) => player.podiums,
        (player) => player.firsts,
        false,
        5,
      ),
    },
    {
      id: "checkmates",
      rows: rankedRows(
        eligible,
        (player) => player.checkmates,
        () => null,
        false,
        5,
      ),
    },
  ]

  return {
    arenaCount: finished.length,
    gameCount: finished.reduce((sum, view) => sum + view.games.length, 0),
    rewards,
  }
}
