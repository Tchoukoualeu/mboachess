import { getDb, isMongoConfigured } from "./mongodb"

const COLLECTION = "tournaments"

// Seed tournaments from FECADE 2026 calendar
const SEED_TOURNAMENTS: Omit<Tournament, "_id" | "createdAt">[] = [
  // May
  {
    name: "Tournoi de l'Unité - Blitz",
    startDate: new Date("2026-05-31T09:00:00"),
    location: "Cameroon",
    description: "PARTIES BLITZ - 5min + 3s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // June
  {
    name: "Championnats Régionaux par Équipe",
    startDate: new Date("2026-06-07T09:00:00"),
    endDate: new Date("2026-06-28T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup (7, 14, 21, 28 Juin)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnat Africain Individuel",
    startDate: new Date("2026-06-18T09:00:00"),
    endDate: new Date("2026-06-29T18:00:00"),
    location: "Africa",
    description: "PARTIE LENTE - 90min/40+30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // July
  {
    name: "Championnats Régionaux par Équipe",
    startDate: new Date("2026-07-05T09:00:00"),
    endDate: new Date("2026-07-26T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup (5, 12, 19, 26 Juillet)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnats Régionaux Individuel Junior",
    startDate: new Date("2026-07-18T09:00:00"),
    endDate: new Date("2026-07-25T18:00:00"),
    location: "Cameroon",
    description: "PARTIES RAPIDES - 30min + 15s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // August
  {
    name: "Championnats Régionaux Individuels Dames",
    startDate: new Date("2026-08-01T09:00:00"),
    endDate: new Date("2026-08-29T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup (1, 8, 29 Août)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnats Régionaux Individuels Opens",
    startDate: new Date("2026-08-02T09:00:00"),
    endDate: new Date("2026-08-30T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 45min + 30s/coup (2, 9, 16, 30 Août)",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Finale de la Coupe du Cameroun des Clubs",
    startDate: new Date("2026-08-27T09:00:00"),
    location: "Cameroon",
    description: "PARTIES RAPIDES - EQUIPE - 20min + 15s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // September
  {
    name: "Olympiades Mondiales des Échecs",
    startDate: new Date("2026-09-15T09:00:00"),
    endDate: new Date("2026-09-27T18:00:00"),
    location: "Uzbekistan",
    description: "LENTES 90min/40 + 30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // October
  {
    name: "Championnat National Individuel Dames",
    startDate: new Date("2026-10-17T09:00:00"),
    endDate: new Date("2026-10-18T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Championnat National Individuel Open",
    startDate: new Date("2026-10-30T09:00:00"),
    endDate: new Date("2026-10-31T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 45min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  // November
  {
    name: "Championnat National Individuel Open",
    startDate: new Date("2026-11-01T09:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 45min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
  {
    name: "Memorial Nguele Viang Michel",
    startDate: new Date("2026-11-21T09:00:00"),
    endDate: new Date("2026-11-22T18:00:00"),
    location: "Cameroon",
    description: "PARTIES LENTES - 30min + 30s/coup",
    link: "https://www.fecade.cm/",
    phone: "+237 659 46 17 38 / +237 675 12 91 23",
  },
]

export type Tournament = {
  _id?: string
  name: string
  startDate: Date
  endDate?: Date
  location?: string
  description?: string
  link?: string
  phone?: string
  isOnline?: boolean
  createdAt: Date
}

export async function getTournaments(): Promise<Tournament[]> {
  const now = new Date()

  // Get seed tournaments that are in the future
  const futureSeedTournaments = SEED_TOURNAMENTS.filter(
    (t) => t.startDate >= now,
  ).map((t) => ({
    ...t,
    createdAt: new Date("2026-04-30"), // Date from the FECADE calendar document
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
      dbTournaments = docs.map((t) => ({
        ...t,
        _id: t._id ? String(t._id) : undefined,
      }))
    }
  }

  // Combine and sort all tournaments by start date
  const allTournaments = [...futureSeedTournaments, ...dbTournaments]
  allTournaments.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  return allTournaments
}

export type SaveTournamentResult = "ok" | "unconfigured" | "invalid"

export async function saveTournament(
  tournament: Omit<Tournament, "_id" | "createdAt">,
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
