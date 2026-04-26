/** Per Chess.com, include a contact; generic Node fetch is often throttled. */
export const CHESSCOM_USER_AGENT =
  "mboachess/1.0 (https://vercel.com; contact: mboachess+api@local)";

/**
 * Treated as “online” if the latest public activity is within this window.
 * Uses the newest of: profile `last_online` and blitz/rapid/bullet `last.date`
 * from stats (the profile timestamp alone is often stale while playing).
 */
export const ONLINE_WITHIN_SEC = 15 * 60;

export type PlayerLookupResult = {
  username: string;
  blitz: number | null;
  rapid: number | null;
  online: boolean;
  lastOnline: number | null;
  error?: string;
};

type ProfilePayload = {
  username: string;
  last_online?: number;
  code?: number;
  message?: string;
};

type GameStatsLast = { last?: { rating?: number; date?: number } };

type StatsPayload = {
  chess_blitz?: GameStatsLast;
  chess_rapid?: GameStatsLast;
  chess_bullet?: GameStatsLast;
  code?: number;
  message?: string;
};

/** Latest Unix activity time from public profile + live rating stats. */
function latestActivitySeconds(
  profile: ProfilePayload,
  stats: StatsPayload | null
): number | null {
  const times: number[] = [];
  if (typeof profile.last_online === "number" && profile.last_online > 0) {
    times.push(profile.last_online);
  }
  if (!stats) {
    return times.length ? Math.max(...times) : null;
  }
  for (const key of ["chess_blitz", "chess_rapid", "chess_bullet"] as const) {
    const d = stats[key]?.last?.date;
    if (typeof d === "number" && d > 0) times.push(d);
  }
  if (times.length === 0) return null;
  return Math.max(...times);
}

export async function fetchPlayerSnapshot(
  username: string
): Promise<PlayerLookupResult> {
  const base = "https://api.chess.com/pub/player";
  const headers = { "User-Agent": CHESSCOM_USER_AGENT };

  const [statsRes, profileRes] = await Promise.all([
    fetch(`${base}/${encodeURIComponent(username)}/stats`, {
      headers,
      cache: "no-store",
    }),
    fetch(`${base}/${encodeURIComponent(username)}`, {
      headers,
      cache: "no-store",
    }),
  ]);

  if (!profileRes.ok) {
    let msg = "Profile not found";
    try {
      const j = (await profileRes.json()) as ProfilePayload;
      if (j?.message) msg = j.message;
    } catch {
      /* ignore */
    }
    return {
      username,
      blitz: null,
      rapid: null,
      online: false,
      lastOnline: null,
      error: msg,
    };
  }

  const profile = (await profileRes.json()) as ProfilePayload;
  const now = Date.now() / 1000;

  if (!statsRes.ok) {
    const lastActivity = latestActivitySeconds(profile, null);
    const online =
      lastActivity != null && now - lastActivity < ONLINE_WITHIN_SEC;
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      online,
      lastOnline: lastActivity,
      error: "Stats unavailable",
    };
  }

  const stats = (await statsRes.json()) as StatsPayload;
  if (typeof stats.code === "number" && stats.message) {
    const lastActivity = latestActivitySeconds(profile, null);
    const online =
      lastActivity != null && now - lastActivity < ONLINE_WITHIN_SEC;
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      online,
      lastOnline: lastActivity,
      error: stats.message,
    };
  }

  const lastActivity = latestActivitySeconds(profile, stats);
  const online =
    lastActivity != null && now - lastActivity < ONLINE_WITHIN_SEC;
  const blitz = stats.chess_blitz?.last?.rating ?? null;
  const rapid = stats.chess_rapid?.last?.rating ?? null;

  return {
    username: profile.username || username,
    blitz,
    rapid,
    online,
    lastOnline: lastActivity,
  };
}
