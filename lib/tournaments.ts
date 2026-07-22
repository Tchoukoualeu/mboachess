import { getDb, isMongoConfigured } from "./mongodb"
import { TOURNAMENT_TIMEZONE } from "./constants"
import {
  fetchChessComTournamentWinners,
  parseChessComTournamentId,
} from "./chesscom"

const COLLECTION = "tournaments"

/**
 * Converts a German time string to UTC for database storage.
 * FECADE tournament times are specified in German time (CET/CEST).
 * Database stores all dates in UTC.
 *
 * @param dateString - ISO date string in German time (e.g., "2026-05-31T09:00:00")
 * @returns Date object in UTC representing that German time
 *
 * @example
 * germanDate("2026-05-31T09:00:00")
 * // Input: 9:00 AM German time (May 2026 = CEST = UTC+2)
 * // Returns: Date object for 2026-05-31T07:00:00.000Z (7:00 AM UTC)
 */
function germanDate(dateString: string): Date {
  // Parse the date components
  const [datePart, timePart] = dateString.split("T")
  const [year, month, day] = datePart.split("-").map(Number)
  const [hour, minute, second = 0] = timePart.split(":").map(Number)

  // Create a formatter for German timezone
  const germanFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TOURNAMENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  // Create a reference date in UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second))

  // Format it in German timezone to get the string representation
  const germanDateString = germanFormatter.format(utcDate)

  // Parse it back - this gives us the wrong date, but we can calculate the offset
  const [datePartGerman, timePartGerman] = germanDateString.split(", ")
  const [m, d, y] = datePartGerman.split("/").map(Number)
  const [h, min, s] = timePartGerman.split(":").map(Number)
  const parsedGermanDate = new Date(y, m - 1, d, h, min, s)

  // Calculate the offset and apply it to get the correct UTC representation
  // This converts German local time to UTC for storage
  const offset = utcDate.getTime() - parsedGermanDate.getTime()
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second) - offset)
}

// Seed tournaments from FECADE 2026 calendar
const SEED_TOURNAMENTS: Omit<Tournament, "_id" | "id" | "createdAt">[] = [
  // May
  {
    name: "Tournoi de l'Unité - Blitz",
    startDate: germanDate("2026-05-31T09:00:00"),
    location: "Cameroon",
    description: "PARTIES BLITZ - 5min + 3s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // June
  {
    name: "Championnats Régionaux par Équipe",
    startDate: germanDate("2026-06-07T09:00:00"),
    endDate: germanDate("2026-06-28T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup (7, 14, 21, 28 Juin)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnat Africain Individuel",
    startDate: germanDate("2026-06-18T09:00:00"),
    endDate: germanDate("2026-06-29T18:00:00"),
    location: "Africa",
    description: "PARTIE LENTE - 90min/40+30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // July
  {
    name: "Championnats Régionaux par Équipe",
    startDate: germanDate("2026-07-05T09:00:00"),
    endDate: germanDate("2026-07-26T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup (5, 12, 19, 26 Juillet)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnats Régionaux Individuel Junior",
    startDate: germanDate("2026-07-18T09:00:00"),
    endDate: germanDate("2026-07-25T18:00:00"),
    location: "Cameroon",
    description: "PARTIES RAPIDES - 30min + 15s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // August
  {
    name: "Championnats Régionaux Individuels Dames",
    startDate: germanDate("2026-08-01T09:00:00"),
    endDate: germanDate("2026-08-29T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup (1, 8, 29 Août)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnats Régionaux Individuels Opens",
    startDate: germanDate("2026-08-02T09:00:00"),
    endDate: germanDate("2026-08-30T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 45min + 30s/coup (2, 9, 16, 30 Août)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Finale de la Coupe du Cameroun des Clubs",
    startDate: germanDate("2026-08-27T09:00:00"),
    location: "Cameroon",
    description: "PARTIES RAPIDES - EQUIPE - 20min + 15s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // September
  {
    name: "Olympiades Mondiales des Échecs",
    startDate: germanDate("2026-09-15T09:00:00"),
    endDate: germanDate("2026-09-27T18:00:00"),
    location: "Uzbekistan",
    description: "LENTES 90min/40 + 30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // October
  {
    name: "Championnat National Individuel Dames",
    startDate: germanDate("2026-10-17T09:00:00"),
    endDate: germanDate("2026-10-18T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnat National Individuel Open",
    startDate: germanDate("2026-10-30T09:00:00"),
    endDate: germanDate("2026-10-31T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 45min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // November
  {
    name: "Championnat National Individuel Open",
    startDate: germanDate("2026-11-01T09:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 45min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Memorial Nguele Viang Michel",
    startDate: germanDate("2026-11-21T09:00:00"),
    endDate: germanDate("2026-11-22T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
]

/**
 * Tournament type definition.
 *
 * IMPORTANT: All Date fields (startDate, endDate, createdAt) are stored in UTC.
 * Dates are displayed in the user's local timezone for better UX.
 * German time (CET/CEST) is shown as a reference since tournaments are German-based.
 * See TIMEZONE.md for details.
 */
export type Tournament = {
  _id?: string
  id: string // Unique stable identifier for all tournaments
  name: string
  startDate: Date // Stored in UTC, displayed in user's timezone
  endDate?: Date // Stored in UTC, displayed in user's timezone
  location?: string
  description?: string
  link?: string
  phone?: string
  isOnline?: boolean
  /**
   * Optional manually stored winner (fallback when Chess.com lookup is not possible).
   * Prefer Chess.com Pub API winners via `withChessComWinners`.
   */
  winner?: string
  createdAt: Date // Stored in UTC
}

export type TournamentWithWinners = Tournament & {
  /** Winner usernames resolved from Chess.com (or stored fallback). */
  winners: string[]
  winnersSource: "chesscom" | "stored" | null
}

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
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  )
  return results
}

/** Attach Chess.com winners (or stored fallback) to each tournament. */
export async function withChessComWinners(
  tournaments: Tournament[],
): Promise<TournamentWithWinners[]> {
  return mapWithConcurrency(tournaments, 4, async (tournament) => {
    if (tournament.link && parseChessComTournamentId(tournament.link)) {
      const result = await fetchChessComTournamentWinners(tournament.link)
      if (result.winners.length > 0) {
        return {
          ...tournament,
          winners: result.winners,
          winnersSource: "chesscom" as const,
        }
      }
    }

    if (tournament.winner?.trim()) {
      return {
        ...tournament,
        winners: [tournament.winner.trim()],
        winnersSource: "stored" as const,
      }
    }

    return {
      ...tournament,
      winners: [],
      winnersSource: null,
    }
  })
}

// Generate a stable ID for seed tournaments based on their content
function generateSeedTournamentId(
  tournament: Omit<Tournament, "_id" | "id" | "createdAt">,
): string {
  // Create a simple hash from name and start date
  const str = `${tournament.name}-${tournament.startDate.toISOString()}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `seed-${Math.abs(hash).toString(36)}`
}

function normalizeTournament(t: Tournament): Tournament {
  return {
    ...t,
    _id: t._id ? String(t._id) : undefined,
    id: t._id ? String(t._id) : generateSeedTournamentId(t),
  }
}

export async function getTournaments(): Promise<Tournament[]> {
  const now = new Date()

  // Get seed tournaments that are in the future
  const futureSeedTournaments = SEED_TOURNAMENTS.filter(
    (t) => t.startDate >= now,
  ).map((t) => ({
    ...t,
    id: generateSeedTournamentId(t),
    createdAt: new Date("2026-04-30T00:00:00Z"), // Date from the FECADE calendar document (UTC)
  }))

  // Get tournaments from database if configured
  let dbTournaments: Tournament[] = []
  if (isMongoConfigured()) {
    const db = await getDb()
    if (db) {
      const docs = await db
        .collection(COLLECTION)
        .find<Tournament>({
          startDate: { $gte: now },
        })
        .sort({ startDate: 1 })
        .toArray()
      // Normalize BSON values (e.g. ObjectId) so loader data is serializable.
      dbTournaments = docs.map(normalizeTournament)
    }
  }

  // Combine and sort all tournaments by start date
  const allTournaments = [...futureSeedTournaments, ...dbTournaments]
  allTournaments.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  return allTournaments
}

/** Past tournaments that were held online (start date before now, isOnline). */
export async function getPastOnlineTournaments(): Promise<Tournament[]> {
  const now = new Date()

  const pastOnlineSeeds = SEED_TOURNAMENTS.filter(
    (t) => t.startDate < now && t.isOnline === true,
  ).map((t) => ({
    ...t,
    id: generateSeedTournamentId(t),
    createdAt: new Date("2026-04-30T00:00:00Z"),
  }))

  let dbTournaments: Tournament[] = []
  if (isMongoConfigured()) {
    const db = await getDb()
    if (db) {
      const docs = await db
        .collection(COLLECTION)
        .find<Tournament>({
          startDate: { $lt: now },
          isOnline: true,
        })
        .sort({ startDate: -1 })
        .toArray()
      dbTournaments = docs.map(normalizeTournament)
    }
  }

  const allTournaments = [...pastOnlineSeeds, ...dbTournaments]
  allTournaments.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

  return allTournaments
}

export async function getTournamentById(
  id: string,
): Promise<Tournament | null> {
  const tournaments = await getTournaments()
  const upcoming = tournaments.find((t) => t.id === id)
  if (upcoming) return upcoming

  const pastOnline = await getPastOnlineTournaments()
  return pastOnline.find((t) => t.id === id) || null
}

export async function getTournamentByIndex(
  index: number,
): Promise<Tournament | null> {
  const tournaments = await getTournaments()
  if (index < 0 || index >= tournaments.length) return null
  return tournaments[index]
}

export type SaveTournamentResult = "ok" | "unconfigured" | "invalid"

export async function saveTournament(
  tournament: Omit<Tournament, "_id" | "id" | "createdAt">,
): Promise<SaveTournamentResult> {
  if (!tournament.name || !tournament.startDate) return "invalid"
  if (!isMongoConfigured()) return "unconfigured"

  const db = await getDb()
  if (!db) return "unconfigured"

  const col = db.collection(COLLECTION)
  await col.insertOne({
    ...tournament,
    createdAt: new Date(),
  })

  return "ok"
}
