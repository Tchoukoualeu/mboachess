/** Per Chess.com, include a contact; generic Node fetch is often throttled. */
export const CHESSCOM_USER_AGENT =
  "mboachess/1.0 (https://vercel.com; contact: mboachess+api@local)"

/**
 * Treated as “online” if the latest public activity is within this window.
 * Uses the newest of: profile `last_online` and blitz/rapid/bullet `last.date`
 * from stats (the profile timestamp alone is often stale while playing).
 */
export const ONLINE_WITHIN_SEC = 15 * 60

export type PlayerLookupResult = {
  username: string
  blitz: number | null
  rapid: number | null
  online: boolean
  lastOnline: number | null
  bullet: number | null
  /** Chess.com `avatar` URL; null if not set or on error. */
  avatarUrl: string | null
  /** ISO country code (e.g., "CM", "US"); null if not available. */
  countryCode: string | null
  /** Chess.com profile created/joined timestamp in Unix seconds. */
  joined: number | null
  error?: string
}

type ProfilePayload = {
  username: string
  last_online?: number
  avatar?: string
  country?: string
  joined?: number
  code?: number
  message?: string
}

type GameStatsLast = { last?: { rating?: number; date?: number } }

type StatsPayload = {
  chess_blitz?: GameStatsLast
  chess_rapid?: GameStatsLast
  chess_bullet?: GameStatsLast
  code?: number
  message?: string
}

/** Extract country code from Chess.com country URL (e.g., ".../country/CM" -> "CM"). */
function extractCountryCode(countryUrl: string | undefined): string | null {
  if (!countryUrl || typeof countryUrl !== "string") return null
  const match = countryUrl.match(/\/country\/([A-Z]{2})$/i)
  return match ? match[1].toUpperCase() : null
}

/** Latest Unix activity time from public profile + live rating stats. */
function latestActivitySeconds(
  profile: ProfilePayload,
  stats: StatsPayload | null,
): number | null {
  const times: number[] = []
  if (typeof profile.last_online === "number" && profile.last_online > 0) {
    times.push(profile.last_online)
  }
  if (!stats) {
    return times.length ? Math.max(...times) : null
  }
  for (const key of ["chess_blitz", "chess_rapid", "chess_bullet"] as const) {
    const d = stats[key]?.last?.date
    if (typeof d === "number" && d > 0) times.push(d)
  }
  if (times.length === 0) return null
  return Math.max(...times)
}

/** How long a cached player snapshot is considered fresh before background refresh. */
const PLAYER_SNAPSHOT_TTL_MS = 60_000

type PlayerCacheEntry = {
  at: number
  data: PlayerLookupResult
  refreshing: boolean
}

const playerSnapshotCache = new Map<string, PlayerCacheEntry>()
/** In-flight fetches keyed by lowercase username — coalesces concurrent lookups. */
const playerSnapshotInflight = new Map<string, Promise<PlayerLookupResult>>()

function cacheKeyForUsername(username: string): string {
  return username.trim().toLowerCase()
}

/** Recompute online from lastOnline so stale cache entries stay accurate. */
function withFreshOnline(data: PlayerLookupResult): PlayerLookupResult {
  const now = Date.now() / 1000
  const online =
    data.lastOnline != null && now - data.lastOnline < ONLINE_WITHIN_SEC
  if (data.online === online) return data
  return { ...data, online }
}

async function fetchPlayerSnapshotUncached(
  username: string,
): Promise<PlayerLookupResult> {
  const base = "https://api.chess.com/pub/player"
  const headers = { "User-Agent": CHESSCOM_USER_AGENT }

  const [statsRes, profileRes] = await Promise.all([
    fetch(`${base}/${encodeURIComponent(username)}/stats`, {
      headers,
      cache: "no-store",
    }),
    fetch(`${base}/${encodeURIComponent(username)}`, {
      headers,
      cache: "no-store",
    }),
  ])

  if (!profileRes.ok) {
    let msg = "Profile not found"
    try {
      const j = (await profileRes.json()) as ProfilePayload
      if (j?.message) msg = j.message
    } catch {
      /* ignore */
    }
    return {
      username,
      blitz: null,
      rapid: null,
      bullet: null,
      online: false,
      lastOnline: null,
      avatarUrl: null,
      countryCode: null,
      joined: null,
      error: msg,
    }
  }

  const profile = (await profileRes.json()) as ProfilePayload
  const avatarUrl =
    typeof profile.avatar === "string" && profile.avatar.startsWith("http")
      ? profile.avatar
      : null
  const countryCode = extractCountryCode(profile.country)
  const now = Date.now() / 1000

  if (!statsRes.ok) {
    const lastActivity = latestActivitySeconds(profile, null)
    const online =
      lastActivity != null && now - lastActivity < ONLINE_WITHIN_SEC
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      bullet: null,
      online,
      lastOnline: lastActivity,
      avatarUrl,
      countryCode,
      joined: profile.joined ?? null,
      error: "Stats unavailable",
    }
  }

  const stats = (await statsRes.json()) as StatsPayload
  if (typeof stats.code === "number" && stats.message) {
    const lastActivity = latestActivitySeconds(profile, null)
    const online =
      lastActivity != null && now - lastActivity < ONLINE_WITHIN_SEC
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      bullet: null,
      online,
      lastOnline: lastActivity,
      avatarUrl,
      countryCode,
      joined: profile.joined ?? null,
      error: stats.message,
    }
  }

  const lastActivity = latestActivitySeconds(profile, stats)
  const online = lastActivity != null && now - lastActivity < ONLINE_WITHIN_SEC
  const blitz = stats.chess_blitz?.last?.rating ?? null
  const rapid = stats.chess_rapid?.last?.rating ?? null
  const bullet = stats.chess_bullet?.last?.rating ?? null

  return {
    username: profile.username || username,
    blitz,
    rapid,
    bullet,
    online,
    lastOnline: lastActivity,
    avatarUrl,
    countryCode,
    joined: profile.joined ?? null,
  }
}

/**
 * Player snapshot via Chess.com Pub API with in-memory stale-while-revalidate
 * cache (60s) and in-flight request coalescing. Shared by home, speed runs, etc.
 */
export async function fetchPlayerSnapshot(
  username: string,
): Promise<PlayerLookupResult> {
  const key = cacheKeyForUsername(username)
  if (!key) {
    return {
      username,
      blitz: null,
      rapid: null,
      bullet: null,
      online: false,
      lastOnline: null,
      avatarUrl: null,
      countryCode: null,
      joined: null,
      error: "Invalid username",
    }
  }

  const entry = playerSnapshotCache.get(key)
  const now = Date.now()

  if (entry) {
    if (now - entry.at >= PLAYER_SNAPSHOT_TTL_MS && !entry.refreshing) {
      // Stale: return immediately and refresh in the background.
      entry.refreshing = true
      void fetchPlayerSnapshotUncached(username)
        .then((fresh) => {
          playerSnapshotCache.set(key, {
            at: Date.now(),
            data: fresh,
            refreshing: false,
          })
        })
        .catch(() => {
          entry.refreshing = false
        })
    }
    return withFreshOnline(entry.data)
  }

  const inflight = playerSnapshotInflight.get(key)
  if (inflight) return inflight.then(withFreshOnline)

  const promise = fetchPlayerSnapshotUncached(username)
    .then((data) => {
      playerSnapshotCache.set(key, {
        at: Date.now(),
        data,
        refreshing: false,
      })
      return data
    })
    .finally(() => {
      playerSnapshotInflight.delete(key)
    })

  playerSnapshotInflight.set(key, promise)
  return promise
}

type TournamentPlayer = {
  username?: string
  status?: string
  is_advancing?: boolean
}

type TournamentPayload = {
  status?: string
  players?: TournamentPlayer[]
  rounds?: string[]
  code?: number
  message?: string
}

type TournamentRoundPayload = {
  players?: TournamentPlayer[]
}

export type TournamentWinnersResult = {
  winners: string[]
  /** Chess.com tournament status when known. */
  status: string | null
  error?: string
}

/**
 * Extract Chess.com tournament URL-ID from a web or API link.
 * Supports `/tournament/{id}` and `/tournament/live/{id}`.
 */
export function parseChessComTournamentId(link: string): string | null {
  try {
    const url = new URL(link.trim())
    if (!/(^|\.)chess\.com$/i.test(url.hostname)) return null

    const match = url.pathname.match(/\/tournament\/(?:live\/)?([^/]+)\/?$/i)
    if (!match?.[1]) return null

    const id = decodeURIComponent(match[1]).trim()
    return id || null
  } catch {
    return null
  }
}

const tournamentWinnerCache = new Map<
  string,
  { at: number; data: TournamentWinnersResult }
>()
const TOURNAMENT_WINNER_TTL_MS = 5 * 60_000

/**
 * Resolve winner usernames for a Chess.com tournament link via the Pub API.
 * Uses `players[].status === "winner"`, with a final-round `is_advancing`
 * fallback for older/knockout tournaments that omit winner status.
 */
export async function fetchChessComTournamentWinners(
  link: string,
): Promise<TournamentWinnersResult> {
  const tournamentId = parseChessComTournamentId(link)
  if (!tournamentId) {
    return {
      winners: [],
      status: null,
      error: "Not a Chess.com tournament link",
    }
  }

  const cached = tournamentWinnerCache.get(tournamentId)
  if (cached && Date.now() - cached.at < TOURNAMENT_WINNER_TTL_MS) {
    return cached.data
  }

  const headers = { "User-Agent": CHESSCOM_USER_AGENT }
  const apiUrl = `https://api.chess.com/pub/tournament/${encodeURIComponent(tournamentId)}`

  try {
    const res = await fetch(apiUrl, { headers, cache: "no-store" })
    if (!res.ok) {
      const data: TournamentWinnersResult = {
        winners: [],
        status: null,
        error: res.status === 404 ? "Tournament not found" : "Lookup failed",
      }
      tournamentWinnerCache.set(tournamentId, { at: Date.now(), data })
      return data
    }

    const payload = (await res.json()) as TournamentPayload
    if (typeof payload.code === "number" && payload.message) {
      const data: TournamentWinnersResult = {
        winners: [],
        status: null,
        error: payload.message,
      }
      tournamentWinnerCache.set(tournamentId, { at: Date.now(), data })
      return data
    }

    const status = typeof payload.status === "string" ? payload.status : null
    let winners = (payload.players ?? [])
      .filter((p) => p.status === "winner" && typeof p.username === "string")
      .map((p) => p.username as string)

    // Fallback: final-round players marked as advancing (common for knockouts).
    if (
      winners.length === 0 &&
      Array.isArray(payload.rounds) &&
      payload.rounds.length > 0
    ) {
      const lastRoundUrl = payload.rounds[payload.rounds.length - 1]
      if (typeof lastRoundUrl === "string" && lastRoundUrl.startsWith("http")) {
        const roundRes = await fetch(lastRoundUrl, {
          headers,
          cache: "no-store",
        })
        if (roundRes.ok) {
          const round = (await roundRes.json()) as TournamentRoundPayload
          winners = (round.players ?? [])
            .filter(
              (p) => p.is_advancing === true && typeof p.username === "string",
            )
            .map((p) => p.username as string)
        }
      }
    }

    const data: TournamentWinnersResult = {
      winners: [...new Set(winners)],
      status,
    }
    tournamentWinnerCache.set(tournamentId, { at: Date.now(), data })
    return data
  } catch {
    return { winners: [], status: null, error: "Network error" }
  }
}
