import { CHESSCOM_USER_AGENT } from "./chesscom"
import { getDb, isMongoConfigured } from "./mongodb"
import {
  chesscomArenaUrl,
  formatArenaDate,
  getProdigeArena,
  PRODIGE_ARENAS,
  type ProdigeArenaDay,
  type ProdigeArenaView,
} from "./prodigeArenaSchedule"

const COLLECTION = "prodige_league_arenas"
const API_BASE = "https://api.chess.com/pub/tournament"

const DRAW_RESULTS = new Set([
  "agreed",
  "repetition",
  "stalemate",
  "insufficient",
  "50move",
  "timevsinsufficient",
])

type StoredPlayer = {
  username: string
  points: number
  place: number
}

type StoredSide = {
  username: string
  rating: number | null
  result: string
}

type StoredGame = {
  url: string
  endTime: number | null
  white: StoredSide
  black: StoredSide
}

type StoredArena = {
  chesscomId: string
  day: number
  name: string
  url: string
  status: string | null
  startTime: number | null
  finishTime: number | null
  players: StoredPlayer[]
  games: StoredGame[]
  syncedAt: Date
}

type ApiSide = {
  username?: string
  rating?: number
  result?: string
}

type ApiGame = {
  url?: string
  end_time?: number
  white?: ApiSide
  black?: ApiSide
}

type ApiPlayer = {
  username?: string
  points?: number
  place_finish?: number
}

type ApiRound = {
  players?: ApiPlayer[]
  games?: ApiGame[]
  groups?: unknown[]
}

type ApiTournament = {
  name?: string
  url?: string
  status?: string
  start_time?: number
  finish_time?: number
  rounds?: string[]
  code?: number
  message?: string
}

function headers(): HeadersInit {
  return { "User-Agent": CHESSCOM_USER_AGENT, Accept: "application/json" }
}

async function getJson(url: string): Promise<unknown | null> {
  const res = await fetch(url, { headers: headers(), cache: "no-store" })
  if (!res.ok) return null
  return res.json() as Promise<unknown>
}

function usernameOf(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed || null
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function gameScore(white: string, black: string): string {
  if (white === "win") return "1–0"
  if (black === "win") return "0–1"
  if (DRAW_RESULTS.has(white) && DRAW_RESULTS.has(black)) return "½–½"
  return "—"
}

function outcome(result: string): "win" | "draw" | "loss" {
  if (result === "win") return "win"
  if (DRAW_RESULTS.has(result)) return "draw"
  return "loss"
}

function formatWhen(unix: number | null): string | null {
  if (!unix) return null
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Douala",
  }).format(new Date(unix * 1000))
}

function formatTime(unix: number | null): string | null {
  if (!unix) return null
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Douala",
  }).format(new Date(unix * 1000))
}

function statusLabel(status: string | null): string {
  if (status === "finished") return "Terminée"
  if (status === "in_progress") return "En cours"
  if (status === "registration") return "Inscriptions ouvertes"
  return "Résultats"
}

function profileUrl(username: string): string {
  return `https://www.chess.com/member/${encodeURIComponent(username)}`
}

async function readRound(url: string, depth = 0): Promise<{
  players: ApiPlayer[]
  games: ApiGame[]
}> {
  if (depth > 3) return { players: [], games: [] }
  const payload = (await getJson(url)) as ApiRound | null
  if (!payload) return { players: [], games: [] }

  const players = Array.isArray(payload.players) ? payload.players : []
  const games = Array.isArray(payload.games) ? payload.games : []
  const groups = Array.isArray(payload.groups) ? payload.groups : []

  for (const group of groups) {
    if (typeof group !== "string" || !group.startsWith("http")) continue
    const nested = await readRound(group, depth + 1)
    players.push(...nested.players)
    games.push(...nested.games)
  }

  return { players, games }
}

function normalizeSnapshot(
  arena: ProdigeArenaDay,
  tournament: ApiTournament,
  round: { players: ApiPlayer[]; games: ApiGame[] },
): StoredArena | null {
  if (!arena.chesscomId) return null

  const displayNames = new Map<string, string>()
  const games: StoredGame[] = []
  const seenGames = new Set<string>()

  for (const game of round.games) {
    const url = typeof game.url === "string" ? game.url : ""
    const whiteName = usernameOf(game.white?.username)
    const blackName = usernameOf(game.black?.username)
    if (!url || !whiteName || !blackName || seenGames.has(url)) continue
    seenGames.add(url)
    displayNames.set(whiteName.toLowerCase(), whiteName)
    displayNames.set(blackName.toLowerCase(), blackName)
    games.push({
      url,
      endTime: numberOrNull(game.end_time),
      white: {
        username: whiteName,
        rating: numberOrNull(game.white?.rating),
        result: typeof game.white?.result === "string" ? game.white.result : "",
      },
      black: {
        username: blackName,
        rating: numberOrNull(game.black?.rating),
        result: typeof game.black?.result === "string" ? game.black.result : "",
      },
    })
  }

  games.sort((a, b) => (a.endTime ?? 0) - (b.endTime ?? 0))

  const byUser = new Map<string, StoredPlayer>()
  for (const player of round.players) {
    const raw = usernameOf(player.username)
    if (!raw) continue
    const key = raw.toLowerCase()
    const username = displayNames.get(key) ?? raw
    const points = numberOrNull(player.points) ?? 0
    const place = numberOrNull(player.place_finish)
    const next: StoredPlayer = {
      username,
      points,
      place: place ?? Number.MAX_SAFE_INTEGER,
    }
    const prev = byUser.get(key)
    if (!prev || next.points > prev.points || next.place < prev.place) {
      byUser.set(key, next)
    }
  }

  const players = [...byUser.values()].sort((a, b) => {
    if (a.place !== b.place) return a.place - b.place
    if (a.points !== b.points) return b.points - a.points
    return a.username.localeCompare(b.username, "fr", { sensitivity: "base" })
  })

  if (players.length === 0) return null

  return {
    chesscomId: arena.chesscomId,
    day: arena.day,
    name:
      typeof tournament.name === "string" && tournament.name.trim()
        ? tournament.name.trim()
        : "Prodige League",
    url:
      typeof tournament.url === "string" && tournament.url.startsWith("http")
        ? tournament.url
        : chesscomArenaUrl(arena.chesscomId),
    status: typeof tournament.status === "string" ? tournament.status : null,
    startTime: numberOrNull(tournament.start_time),
    finishTime: numberOrNull(tournament.finish_time),
    players: players.map((player, index) => ({
      ...player,
      place:
        player.place === Number.MAX_SAFE_INTEGER ? index + 1 : player.place,
    })),
    games,
    syncedAt: new Date(),
  }
}

async function fetchSnapshot(arena: ProdigeArenaDay): Promise<StoredArena | null> {
  if (!arena.chesscomId) return null
  const tournament = (await getJson(
    `${API_BASE}/${encodeURIComponent(arena.chesscomId)}`,
  )) as ApiTournament | null
  if (!tournament || typeof tournament.code === "number") return null

  const roundUrls =
    Array.isArray(tournament.rounds) && tournament.rounds.length > 0
      ? tournament.rounds.filter((url) => typeof url === "string")
      : [`${API_BASE}/${encodeURIComponent(arena.chesscomId)}/1`]

  const players: ApiPlayer[] = []
  const games: ApiGame[] = []
  for (const url of roundUrls) {
    const round = await readRound(url)
    players.push(...round.players)
    games.push(...round.games)
  }

  return normalizeSnapshot(arena, tournament, { players, games })
}

async function readStored(chesscomId: string): Promise<StoredArena | null> {
  if (!isMongoConfigured()) return null
  const db = await getDb()
  if (!db) return null
  const doc = await db.collection(COLLECTION).findOne<StoredArena>({ chesscomId })
  if (!doc || !Array.isArray(doc.players)) return null
  return {
    ...doc,
    games: Array.isArray(doc.games) ? doc.games : [],
    syncedAt: doc.syncedAt instanceof Date ? doc.syncedAt : new Date(0),
  }
}

async function saveStored(snapshot: StoredArena): Promise<void> {
  if (!isMongoConfigured()) return
  const db = await getDb()
  if (!db) return
  const { syncedAt, ...fields } = snapshot
  await db.collection(COLLECTION).updateOne(
    { chesscomId: snapshot.chesscomId },
    { $set: { ...fields, syncedAt } },
    { upsert: true },
  )
}

/** A finished arena with standings is final. Later visits read the database only. */
function isComplete(snapshot: StoredArena): boolean {
  return snapshot.status === "finished" && snapshot.players.length > 0
}

function toView(
  arena: ProdigeArenaDay,
  snapshot: StoredArena,
  notice: string | null,
  error: string | null,
): ProdigeArenaView {
  const records = new Map<
    string,
    { wins: number; draws: number; losses: number }
  >()
  const bump = (username: string, result: string) => {
    const key = username.toLowerCase()
    const row = records.get(key) ?? { wins: 0, draws: 0, losses: 0 }
    const kind = outcome(result)
    if (kind === "win") row.wins += 1
    else if (kind === "draw") row.draws += 1
    else row.losses += 1
    records.set(key, row)
  }

  for (const game of snapshot.games) {
    bump(game.white.username, game.white.result)
    bump(game.black.username, game.black.result)
  }

  return {
    day: arena.day,
    dateLabel: formatArenaDate(arena.date),
    name: snapshot.name,
    chesscomUrl: snapshot.url,
    statusLabel: statusLabel(snapshot.status),
    whenLabel: formatWhen(snapshot.startTime),
    notice,
    error,
    players: snapshot.players.map((player) => {
      const record = records.get(player.username.toLowerCase()) ?? {
        wins: 0,
        draws: 0,
        losses: 0,
      }
      return {
        place: player.place,
        username: player.username,
        points: player.points,
        wins: record.wins,
        draws: record.draws,
        losses: record.losses,
        profileUrl: profileUrl(player.username),
      }
    }),
    games: snapshot.games.map((game) => ({
      url: game.url,
      timeLabel: formatTime(game.endTime),
      white: game.white.username,
      whiteRating: game.white.rating,
      black: game.black.username,
      blackRating: game.black.rating,
      score: gameScore(game.white.result, game.black.result),
    })),
  }
}

function emptyView(arena: ProdigeArenaDay, error: string): ProdigeArenaView {
  return {
    day: arena.day,
    dateLabel: formatArenaDate(arena.date),
    name: "Prodige League",
    chesscomUrl: arena.chesscomId ? chesscomArenaUrl(arena.chesscomId) : "",
    statusLabel: "Résultats",
    whenLabel: null,
    notice: null,
    error,
    players: [],
    games: [],
  }
}

/**
 * Load one arena's standings and games.
 * Finished arenas are served from the database. Chess.com is called only
 * when nothing complete is stored yet, including while an arena is in progress.
 */
export async function loadProdigeArenaResults(
  dayRaw: string,
): Promise<ProdigeArenaView | null> {
  const day = Number(dayRaw)
  if (!Number.isInteger(day)) return null
  const arena = getProdigeArena(day)
  if (!arena?.chesscomId) return null

  const cached = await readStored(arena.chesscomId).catch(() => null)
  if (cached && isComplete(cached)) return toView(arena, cached, null, null)

  try {
    const fresh = await fetchSnapshot(arena)
    if (fresh) {
      try {
        await saveStored(fresh)
      } catch {
        return toView(
          arena,
          fresh,
          "Résultats Chess.com affichés. L'enregistrement en base a échoué.",
          null,
        )
      }
      return toView(arena, fresh, null, null)
    }
  } catch {
    // Fall through to the stored snapshot.
  }

  if (cached) {
    return toView(
      arena,
      cached,
      null,
      "Chess.com n'a pas répondu. Résultats enregistrés lors d'une visite précédente.",
    )
  }

  return emptyView(
    arena,
    "Les résultats n'ont pas pu être chargés depuis Chess.com.",
  )
}

export type ProdigeArenaWinner = {
  day: number
  username: string
  points: number
  profileUrl: string
}

/** First-place player of each finished arena. Upcoming days are omitted. */
export async function loadProdigeArenaWinners(): Promise<ProdigeArenaWinner[]> {
  const winners: ProdigeArenaWinner[] = []
  for (const arena of PRODIGE_ARENAS) {
    if (!arena.chesscomId) continue
    const view = await loadProdigeArenaResults(String(arena.day))
    if (!view || view.statusLabel !== "Terminée" || view.players.length === 0) {
      continue
    }
    const first =
      view.players.find((player) => player.place === 1) ?? view.players[0]
    winners.push({
      day: arena.day,
      username: first.username,
      points: first.points,
      profileUrl: first.profileUrl,
    })
  }
  return winners
}
