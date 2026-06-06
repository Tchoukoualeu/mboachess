import { getDb, isMongoConfigured } from "./mongodb"

const COLLECTION = "contentCreators"

export type ContentCreator = {
  _id?: string
  name: string
  email?: string
  phone?: string
  website?: string
  youtube?: string
  twitter?: string
  instagram?: string
  facebook?: string
  twitch?: string
  contentType?: string
  description?: string
  createdAt: Date
}

export async function getContentCreators(): Promise<ContentCreator[]> {
  if (!isMongoConfigured()) return []
  const db = await getDb()
  if (!db) return []

  const creators = await db
    .collection(COLLECTION)
    .find<ContentCreator>({})
    .sort({ name: 1 })
    .toArray()

  return creators
}

export type SaveContentCreatorResult = "ok" | "unconfigured" | "invalid"

export async function saveContentCreator(
  creator: Omit<ContentCreator, "_id" | "createdAt">,
): Promise<SaveContentCreatorResult> {
  if (!creator.name) return "invalid"
  if (!isMongoConfigured()) return "unconfigured"

  const db = await getDb()
  if (!db) return "unconfigured"

  const col = db.collection(COLLECTION)
  await col.insertOne({
    ...creator,
    createdAt: new Date(),
  })

  return "ok"
}
