import { createServerFn } from "@tanstack/react-start"
import { fetchPlayerSnapshot, type PlayerLookupResult } from "@/lib/chesscom"
import {
  loadProdigeArenaWinners,
  type ProdigeArenaWinner,
} from "@/lib/prodigeArenaResults"
import {
  listProdigeLeagueRegistrations,
  type ProdigeLeaguePlayer,
} from "@/lib/prodigeLeague"

export type ProdigeArenaCardWinner = ProdigeArenaWinner & {
  avatarUrl: string | null
}

export type ProdigeLeagueData = {
  players: ProdigeLeaguePlayer[]
  winners: ProdigeArenaCardWinner[]
}

const FETCH_CONCURRENCY = 8

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

function ratingValue(value: number | null): number {
  return typeof value === "number" ? value : Number.NEGATIVE_INFINITY
}

function sortPlayers(players: ProdigeLeaguePlayer[]): ProdigeLeaguePlayer[] {
  return players.sort((a, b) => {
    const byRapid = ratingValue(b.rapid) - ratingValue(a.rapid)
    if (byRapid !== 0) return byRapid
    return a.username.localeCompare(b.username, undefined, {
      sensitivity: "base",
    })
  })
}

function toPlayer(
  registeredAt: Date,
  snapshot: PlayerLookupResult,
): ProdigeLeaguePlayer {
  return {
    username: snapshot.username,
    registeredAt: registeredAt.toISOString(),
    avatarUrl: snapshot.avatarUrl,
    countryCode: snapshot.countryCode,
    rapid: snapshot.rapid,
    blitz: snapshot.blitz,
    bullet: snapshot.bullet,
    online: snapshot.online,
  }
}

async function withWinnerAvatars(
  winners: ProdigeArenaWinner[],
): Promise<ProdigeArenaCardWinner[]> {
  return mapWithConcurrency(winners, FETCH_CONCURRENCY, async (winner) => {
    const snapshot = await fetchPlayerSnapshot(winner.username)
    return {
      ...winner,
      avatarUrl: snapshot.avatarUrl,
    }
  })
}

export const loadProdigeLeague = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProdigeLeagueData> => {
    const [registrations, rawWinners] = await Promise.all([
      listProdigeLeagueRegistrations(),
      loadProdigeArenaWinners(),
    ])
    const winners = await withWinnerAvatars(rawWinners)
    if (registrations.length === 0) return { players: [], winners }

    const players = await mapWithConcurrency(
      registrations,
      FETCH_CONCURRENCY,
      async (registration) => {
        const snapshot = await fetchPlayerSnapshot(registration.username)
        return toPlayer(registration.createdAt, snapshot)
      },
    )

    return { players: sortPlayers(players), winners }
  },
)
