import { getDb, isMongoConfigured } from "./mongodb"

const COLLECTION = "clubs"

export type Club = {
  _id?: string
  name: string
  location?: string
  description?: string
  contactName?: string
  email?: string
  phone?: string
  website?: string
  meetingSchedule?: string
  createdAt: Date
}

export async function getClubs(): Promise<Club[]> {
  if (!isMongoConfigured()) return []
  const db = await getDb()
  if (!db) return []

  const clubs = await db
    .collection(COLLECTION)
    .find<Club>({})
    .sort({ name: 1 })
    .toArray()

  // Normalize BSON values (e.g. ObjectId) so loader data is serializable.
  return clubs.map((c) => ({ ...c, _id: c._id ? String(c._id) : undefined }))
}

export type SaveClubResult = "ok" | "unconfigured" | "invalid"

export async function saveClub(
  club: Omit<Club, "_id" | "createdAt">,
): Promise<SaveClubResult> {
  if (!club.name) return "invalid"
  if (!isMongoConfigured()) return "unconfigured"

  const db = await getDb()
  if (!db) return "unconfigured"

  const col = db.collection(COLLECTION)
  await col.insertOne({
    ...club,
    createdAt: new Date(),
  })

  return "ok"
}
