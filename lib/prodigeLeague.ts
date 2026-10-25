import { fetchPlayerSnapshot, isClosedChesscomAccount } from "./chesscom"
import { normalizeChesscomUsername } from "./chesscomUsernames"
import { getDb, isMongoConfigured } from "./mongodb"

const COLLECTION = "prodige_league_registrations"

/** Rapid is the season cadence. Ratings above this cannot register. */
const MAX_RAPID_RATING = 2400

export type ProdigeLeagueRegistration = {
  username: string
  createdAt: Date
}

export type ProdigeLeaguePlayer = {
  username: string
  registeredAt: string
  avatarUrl: string | null
  countryCode: string | null
  rapid: number | null
  blitz: number | null
  bullet: number | null
  online: boolean
}

export type RegisterProdigeLeagueResult =
  | { ok: true; already: boolean }
  | { ok: false; error: string; status: number }

export async function listProdigeLeagueRegistrations(): Promise<
  ProdigeLeagueRegistration[]
> {
  if (!isMongoConfigured()) return []
  const db = await getDb()
  if (!db) return []
  const docs = await db
    .collection(COLLECTION)
    .find<{ username: string; createdAt?: Date }>({})
    .sort({ createdAt: 1 })
    .toArray()
  return docs
    .filter((doc) => typeof doc.username === "string" && doc.username)
    .map((doc) => ({
      username: doc.username,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(0),
    }))
}

/**
 * Store a Chess.com account for Prodige League.
 * Confirms the public profile exists and is not closed before insert.
 */
export async function registerProdigeLeague(
  raw: string,
): Promise<RegisterProdigeLeagueResult> {
  const username = normalizeChesscomUsername(raw)
  if (!username) {
    return {
      ok: false,
      error:
        "Pseudo invalide (1 à 50 lettres, chiffres, tiret ou underscore).",
      status: 400,
    }
  }
  if (!isMongoConfigured()) {
    return {
      ok: false,
      error: "La base de données n'est pas configurée.",
      status: 503,
    }
  }
  const db = await getDb()
  if (!db) {
    return {
      ok: false,
      error: "La base de données n'est pas configurée.",
      status: 503,
    }
  }

  const col = db.collection(COLLECTION)
  const existing = await col.findOne({ username })
  if (existing) return { ok: true, already: true }

  const snapshot = await fetchPlayerSnapshot(username)
  if (snapshot.error && /not found|invalid username/i.test(snapshot.error)) {
    return {
      ok: false,
      error: "Compte Chess.com introuvable.",
      status: 404,
    }
  }
  if (isClosedChesscomAccount(snapshot.accountStatus)) {
    return {
      ok: false,
      error: "Ce compte Chess.com est fermé.",
      status: 400,
    }
  }
  if (
    typeof snapshot.rapid === "number" &&
    snapshot.rapid > MAX_RAPID_RATING
  ) {
    return {
      ok: false,
      error: `Inscription réservée aux joueurs à ${MAX_RAPID_RATING} Elo rapide ou moins.`,
      status: 400,
    }
  }

  const canonical = snapshot.username.trim().toLowerCase() || username
  const result = await col.updateOne(
    { username: canonical },
    { $setOnInsert: { username: canonical, createdAt: new Date() } },
    { upsert: true },
  )
  if (result.upsertedCount === 1) return { ok: true, already: false }
  return { ok: true, already: true }
}
