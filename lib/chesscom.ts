/** Per Chess.com, include a contact; generic Node fetch is often throttled. */
export const CHESSCOM_USER_AGENT =
  "mboachess/1.0 (https://vercel.com; contact: mboachess+api@local)";

/** Chess.com retires the /is-online endpoint; 5 min matches their old behavior. */
export const ONLINE_WITHIN_SEC = 5 * 60;

export type PlayerLookupResult = {
  username: string;
  blitz: number | null;
  rapid: number | null;
  online: boolean;
  lastOnline: number | null;
  error?: string;
};

type StatsPayload = {
  chess_blitz?: { last?: { rating?: number } };
  chess_rapid?: { last?: { rating?: number } };
  code?: number;
  message?: string;
};

type ProfilePayload = {
  username: string;
  last_online: number;
  code?: number;
  message?: string;
};

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
  const lastOnline = profile.last_online ?? null;
  const now = Date.now() / 1000;
  const online =
    lastOnline != null && now - lastOnline < ONLINE_WITHIN_SEC;

  if (!statsRes.ok) {
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      online,
      lastOnline,
      error: "Stats unavailable",
    };
  }

  const stats = (await statsRes.json()) as StatsPayload;
  if (typeof stats.code === "number" && stats.message) {
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      online,
      lastOnline,
      error: stats.message,
    };
  }

  const blitz = stats.chess_blitz?.last?.rating ?? null;
  const rapid = stats.chess_rapid?.last?.rating ?? null;

  return {
    username: profile.username || username,
    blitz,
    rapid,
    online,
    lastOnline,
  };
}
