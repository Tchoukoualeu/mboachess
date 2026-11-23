import { createServerFn } from "@tanstack/react-start"
import { fetchPlayerSnapshot, type PlayerLookupResult } from "@/lib/chesscom"
import {
  loadProdigeArenaDigest,
  type ProdigeArenaLeader,
  type ProdigeArenaWinner,
} from "@/lib/prodigeArenaResults"
import {
  listProdigeLeagueRegistrations,
  type ProdigeLeaguePlayer,
} from "@/lib/prodigeLeague"

export type ProdigeArenaCardWinner = ProdigeArenaWinner & {
  avatarUrl: string | null
}

export type ProdigeArenaCardLeader = ProdigeArenaLeader & {
  avatarUrl: string | null
}

export type ProdigeLeagueData = {
  winners: ProdigeArenaCardWinner[]
  leaders: ProdigeArenaCardLeader[]
  banned: ProdigeArenaCardLeader[]
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

async function avatarMap(
  usernames: string[],
): Promise<Map<string, string | null>> {
  const unique = [...new Set(usernames.map((username) => username.toLowerCase()))]
  const snapshots = await mapWithConcurrency(
    unique,
    FETCH_CONCURRENCY,
    (username) => fetchPlayerSnapshot(username),
  )
  return new Map(
    unique.map((username, index) => [username, snapshots[index]?.avatarUrl ?? null]),
  )
}

export const loadProdigeLeague = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProdigeLeagueData> => {
    const digest = await loadProdigeArenaDigest()
    const avatars = await avatarMap([
      ...digest.winners.map((winner) => winner.username),
      ...digest.leaders.map((leader) => leader.username),
      ...digest.banned.map((player) => player.username),
    ])
    const winners = digest.winners.map((winner) => ({
      ...winner,
      avatarUrl: avatars.get(winner.username.toLowerCase()) ?? null,
    }))
    const withAvatar = (leader: ProdigeArenaLeader): ProdigeArenaCardLeader => ({
      ...leader,
      avatarUrl: avatars.get(leader.username.toLowerCase()) ?? null,
    })
    const leaders = digest.leaders.map(withAvatar)
    const banned = digest.banned.map(withAvatar)
    return { winners, leaders, banned }
  },
)

/** Registered players with live Chess.com ratings. Slow when the cache is cold, so the page streams it. */
export const loadProdigeLeaguePlayers = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProdigeLeaguePlayer[]> => {
    const registrations = await listProdigeLeagueRegistrations()
    if (registrations.length === 0) return []

    const players = await mapWithConcurrency(
      registrations,
      FETCH_CONCURRENCY,
      async (registration) => {
        const snapshot = await fetchPlayerSnapshot(registration.username)
        return toPlayer(registration.createdAt, snapshot)
      },
    )

    return sortPlayers(players)
  },
)
