import { intlLocale, type Locale } from "@/lib/i18n"

/** Qualification arenas for Prodige League 2026. Days 4–6 stay undated until announced. */
export const PRODIGE_ARENAS = [
  {
    day: 1,
    date: "2026-11-15",
    chesscomId: "prodige-league-31120826",
  },
  {
    day: 2,
    date: "2026-11-19",
    chesscomId: "prodige-league-2-31202506",
  },
  {
    day: 3,
    date: "2026-11-22",
    chesscomId: "prodige-league-arene-3-31215858",
  },
  { day: 4, date: null, chesscomId: null },
  { day: 5, date: null, chesscomId: null },
  { day: 6, date: null, chesscomId: null },
] as const

export type ProdigeArenaDay = (typeof PRODIGE_ARENAS)[number]

export function chesscomArenaUrl(chesscomId: string): string {
  return `https://www.chess.com/tournament/live/arena/${encodeURIComponent(chesscomId)}`
}

/** Calendar date in the visitor's language. Empty string when the date is still open. */
export function formatArenaDate(iso: string | null, locale: Locale = "fr"): string {
  if (!iso) return ""
  const date = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export function getProdigeArena(day: number): ProdigeArenaDay | null {
  return PRODIGE_ARENAS.find((arena) => arena.day === day) ?? null
}

export type ProdigeArenaPlayerView = {
  place: number
  username: string
  points: number
  wins: number
  draws: number
  losses: number
  profileUrl: string
}

export type ProdigeArenaStatus =
  | "finished"
  | "in_progress"
  | "registration"
  | "results"

export type ProdigeArenaNoticeCode = "saveFailed"
export type ProdigeArenaErrorCode = "stale" | "loadFailed"

export type ProdigeArenaGameView = {
  url: string
  endTime: number | null
  timeLabel: string | null
  white: string
  whiteRating: number | null
  black: string
  blackRating: number | null
  score: string
}

export type ProdigeArenaView = {
  day: number
  date: string | null
  dateLabel: string
  name: string
  chesscomUrl: string
  status: ProdigeArenaStatus
  startTime: number | null
  statusLabel: string
  whenLabel: string | null
  noticeCode: ProdigeArenaNoticeCode | null
  errorCode: ProdigeArenaErrorCode | null
  notice: string | null
  error: string | null
  players: ProdigeArenaPlayerView[]
  games: ProdigeArenaGameView[]
}
