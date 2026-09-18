import { CHESSCOM_USER_AGENT } from "@/lib/chesscom"

export type TopPlayerMode = "blitz" | "rapid"

export type CameroonTopPlayer = {
  rank: number
  username: string
  rating: number
  avatarUrl: string | null
  winCount: number
  lossCount: number
  drawCount: number
  gameCount: number
}

export type CameroonTopPlayersData = {
  blitz: CameroonTopPlayer[]
  rapid: CameroonTopPlayer[]
  fetchedAt: string
}

const COUNTRY = "CM"
const TOP_N = 100
const PAGE_SIZE = 50
const CACHE_TTL_MS = 30 * 60 * 1000

type LeaderboardUser = {
  username?: string
  avatar_url?: string
}

type LeaderboardEntry = {
  rank?: number
  score?: number
  totalGameCount?: number
  totalWinCount?: number
  totalLossCount?: number
  totalDrawCount?: number
  user?: LeaderboardUser
}

type LeaderboardPayload = {
  leaders?: LeaderboardEntry[]
}

type CacheEntry = {
  at: number
  data: CameroonTopPlayersData
  refreshing: boolean
}

let cache: CacheEntry | null = null
let inflight: Promise<CameroonTopPlayersData> | null = null

function normalizeAvatarUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null
  if (!url.startsWith("http")) return null
  // Chess.com default placeholder — treat as missing so the CM flag shows.
  if (/\/noavatar/i.test(url)) return null
  return url
}

function toPlayer(entry: LeaderboardEntry, index: number): CameroonTopPlayer | null {
  const username = entry.user?.username?.trim()
  const rating = entry.score
  if (!username || typeof rating !== "number") return null
  return {
    rank: typeof entry.rank === "number" ? entry.rank : index + 1,
    username,
    rating,
    avatarUrl: normalizeAvatarUrl(entry.user?.avatar_url),
    winCount: entry.totalWinCount ?? 0,
    lossCount: entry.totalLossCount ?? 0,
    drawCount: entry.totalDrawCount ?? 0,
    gameCount: entry.totalGameCount ?? 0,
  }
}

async function fetchLeaderboardPage(
  mode: TopPlayerMode,
  page: number,
): Promise<CameroonTopPlayer[]> {
  const url = `https://www.chess.com/callback/leaderboard/live/${mode}?country=${COUNTRY}&page=${page}`
  const response = await fetch(url, {
    headers: {
      "User-Agent": CHESSCOM_USER_AGENT,
      Accept: "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Chess.com ${mode} leaderboard failed (${response.status}).`)
  }

  const payload = (await response.json()) as LeaderboardPayload
  const leaders = payload.leaders ?? []
  return leaders
    .map((entry, index) => toPlayer(entry, (page - 1) * PAGE_SIZE + index))
    .filter((player): player is CameroonTopPlayer => player != null)
}

async function fetchTopForMode(mode: TopPlayerMode): Promise<CameroonTopPlayer[]> {
  const pagesNeeded = Math.ceil(TOP_N / PAGE_SIZE)
  const pages = await Promise.all(
    Array.from({ length: pagesNeeded }, (_, i) =>
      fetchLeaderboardPage(mode, i + 1),
    ),
  )
  const merged = pages.flat()
  const seen = new Set<string>()
  const unique: CameroonTopPlayer[] = []
  for (const player of merged) {
    const key = player.username.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(player)
    if (unique.length >= TOP_N) break
  }
  return unique
}

async function fetchCameroonTopPlayersUncached(): Promise<CameroonTopPlayersData> {
  const [blitz, rapid] = await Promise.all([
    fetchTopForMode("blitz"),
    fetchTopForMode("rapid"),
  ])
  return {
    blitz,
    rapid,
    fetchedAt: new Date().toISOString(),
  }
}

/** Top 100 Cameroon Chess.com players by live blitz and rapid (cached 30m). */
export async function getCameroonTopPlayers(): Promise<CameroonTopPlayersData> {
  const now = Date.now()

  if (cache) {
    if (now - cache.at >= CACHE_TTL_MS && !cache.refreshing) {
      cache.refreshing = true
      void fetchCameroonTopPlayersUncached()
        .then((fresh) => {
          cache = { at: Date.now(), data: fresh, refreshing: false }
        })
        .catch(() => {
          if (cache) cache.refreshing = false
        })
    }
    return cache.data
  }

  if (inflight) return inflight

  inflight = fetchCameroonTopPlayersUncached()
    .then((data) => {
      cache = { at: Date.now(), data, refreshing: false }
      return data
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}
