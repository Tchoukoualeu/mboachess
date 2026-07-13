const CHESSCOM_USER_AGENT = "mboachess/1.0 (https://vercel.com; contact: mboachess+api@local)";
const ONLINE_WITHIN_SEC = 15 * 60;
function extractCountryCode(countryUrl) {
  if (!countryUrl || typeof countryUrl !== "string") return null;
  const match = countryUrl.match(/\/country\/([A-Z]{2})$/i);
  return match ? match[1].toUpperCase() : null;
}
function latestActivitySeconds(profile, stats) {
  const times = [];
  if (typeof profile.last_online === "number" && profile.last_online > 0) {
    times.push(profile.last_online);
  }
  if (!stats) {
    return times.length ? Math.max(...times) : null;
  }
  for (const key of ["chess_blitz", "chess_rapid", "chess_bullet"]) {
    const d = stats[key]?.last?.date;
    if (typeof d === "number" && d > 0) times.push(d);
  }
  if (times.length === 0) return null;
  return Math.max(...times);
}
async function fetchPlayerSnapshot(username) {
  const base = "https://api.chess.com/pub/player";
  const headers = { "User-Agent": CHESSCOM_USER_AGENT };
  const [statsRes, profileRes] = await Promise.all([
    fetch(`${base}/${encodeURIComponent(username)}/stats`, {
      headers,
      cache: "no-store"
    }),
    fetch(`${base}/${encodeURIComponent(username)}`, {
      headers,
      cache: "no-store"
    })
  ]);
  if (!profileRes.ok) {
    let msg = "Profile not found";
    try {
      const j = await profileRes.json();
      if (j?.message) msg = j.message;
    } catch {
    }
    return {
      username,
      blitz: null,
      rapid: null,
      online: false,
      lastOnline: null,
      avatarUrl: null,
      countryCode: null,
      error: msg
    };
  }
  const profile = await profileRes.json();
  const avatarUrl = typeof profile.avatar === "string" && profile.avatar.startsWith("http") ? profile.avatar : null;
  const countryCode = extractCountryCode(profile.country);
  const now = Date.now() / 1e3;
  if (!statsRes.ok) {
    const lastActivity2 = latestActivitySeconds(profile, null);
    const online2 = lastActivity2 != null && now - lastActivity2 < ONLINE_WITHIN_SEC;
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      online: online2,
      lastOnline: lastActivity2,
      avatarUrl,
      countryCode,
      error: "Stats unavailable"
    };
  }
  const stats = await statsRes.json();
  if (typeof stats.code === "number" && stats.message) {
    const lastActivity2 = latestActivitySeconds(profile, null);
    const online2 = lastActivity2 != null && now - lastActivity2 < ONLINE_WITHIN_SEC;
    return {
      username: profile.username || username,
      blitz: null,
      rapid: null,
      online: online2,
      lastOnline: lastActivity2,
      avatarUrl,
      countryCode,
      error: stats.message
    };
  }
  const lastActivity = latestActivitySeconds(profile, stats);
  const online = lastActivity != null && now - lastActivity < ONLINE_WITHIN_SEC;
  const blitz = stats.chess_blitz?.last?.rating ?? null;
  const rapid = stats.chess_rapid?.last?.rating ?? null;
  return {
    username: profile.username || username,
    blitz,
    rapid,
    online,
    lastOnline: lastActivity,
    avatarUrl,
    countryCode
  };
}
export {
  ONLINE_WITHIN_SEC as O,
  fetchPlayerSnapshot as f
};
