import { useRouterState } from "@tanstack/react-router"
import { en } from "@/locales/en"
import { fr, type Dictionary } from "@/locales/fr"

export type Locale = "fr" | "en"
export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { fr, en }

export function intlLocale(locale: Locale): string {
  return locale === "fr" ? "fr-FR" : "en-GB"
}

export function ogLocale(locale: Locale): string {
  return locale === "fr" ? "fr_FR" : "en_US"
}

export function isLocale(value: string): value is Locale {
  return value === "fr" || value === "en"
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr"
}

export function stripLocale(pathname: string): string {
  if (pathname === "/en" || pathname === "/en/") return "/"
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/"
  return pathname || "/"
}

export function localizePath(path: string, locale: Locale): string {
  const [barePath, query] = path.split("?")
  const bare = stripLocale(barePath || "/")
  const localized = locale === "fr" || bare === "/" ? (locale === "fr" ? bare : "/en") : `/en${bare}`
  return query ? `${localized}?${query}` : localized
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export function fill(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}

export function noun(locale: Locale, count: number): string {
  const dict = getDictionary(locale)
  return count === 1 ? dict.common.player : dict.common.players
}

export function useLocale(): Locale {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  return localeFromPath(pathname)
}

export function useDictionary(): Dictionary {
  return getDictionary(useLocale())
}

export function useRouteLoaderData<T>(): T {
  const data = useRouterState({
    select: (state) => state.matches[state.matches.length - 1]?.loaderData,
  })
  return data as T
}

const API_ERRORS: Record<string, keyof Dictionary["errors"]> = {
  "Invalid JSON": "invalidJson",
  "Invalid request": "invalidRequest",
  "Missing tournament name": "missingTournamentName",
  "Missing start date": "missingStartDate",
  "Invalid start date": "invalidStartDate",
  "Tournament must start in the future": "startInFuture",
  "Database is not configured on the server.": "database",
  "Invalid tournament data": "invalidTournament",
  "Missing username": "missingUsername",
  "Invalid username (use 1–50 letters, numbers, underscore, or hyphen only).":
    "invalidUsernameRules",
  "Invalid username": "invalidUsername",
  "Missing club name": "missingClubName",
  "Invalid club data": "invalidClub",
  "Missing content creator name": "missingCreatorName",
  "Invalid content creator data": "invalidCreator",
  "Invalid rating type.": "invalidRatingType",
  "Missing competition ID or username.": "missingCompetition",
  "Competition not found.": "competitionNotFound",
  "Registration is closed for this competition.": "registrationClosed",
  "Chess.com profile not found.": "profileNotFound",
  "Chess.com account must be at least 60 days old at competition start.":
    "accountTooNew",
  "Les inscriptions sont closes.": "signupClosed",
  "Could not load a puzzle.": "puzzleLoad",
  "The puzzle response was incomplete.": "puzzleIncomplete",
}

const MIN_RATING = /^Minimum (blitz|rapid|bullet) rating is (\d+)\.$/

export function translateApiError(
  message: string | undefined,
  dict: Dictionary,
  fallback: string,
): string {
  if (!message) return fallback
  const key = API_ERRORS[message]
  if (key) return dict.errors[key]
  const min = MIN_RATING.exec(message)
  if (min) {
    const type = min[1] as "blitz" | "rapid" | "bullet"
    return fill(dict.errors.minRating, {
      type: dict.common[type],
      rating: min[2],
    })
  }
  return message
}

export function formatWhen(unix: number | null, locale: Locale): string | null {
  if (!unix) return null
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Douala",
  }).format(new Date(unix * 1000))
}

export function formatClock(unix: number | null, locale: Locale): string | null {
  if (!unix) return null
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Douala",
  }).format(new Date(unix * 1000))
}
