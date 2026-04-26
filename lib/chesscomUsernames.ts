import { getDb, isMongoConfigured } from "./mongodb";

const COLLECTION = "player_usernames";

/** Chess.com on-site usernames: letters, digits, underscore, hyphen. */
export function normalizeChesscomUsername(input: string): string | null {
  const s = input.trim().replace(/^@/, "").toLowerCase();
  if (!s) return null;
  if (!/^[a-z0-9_-]{1,50}$/i.test(s)) return null;
  return s;
}

export async function getSubmittedUsernames(): Promise<string[]> {
  if (!isMongoConfigured()) return [];
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection(COLLECTION)
    .find<{
      username: string;
    }>({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => d.username);
}

export type SaveUsernameResult = "ok" | "exists" | "unconfigured" | "invalid";

/**
 * Returns ok on new registration, exists if the username was already stored.
 */
export async function saveUsername(
  raw: string
): Promise<SaveUsernameResult> {
  const username = normalizeChesscomUsername(raw);
  if (!username) return "invalid";
  if (!isMongoConfigured()) return "unconfigured";
  const db = await getDb();
  if (!db) return "unconfigured";
  const col = db.collection(COLLECTION);
  const r = await col.updateOne(
    { username },
    { $setOnInsert: { username, createdAt: new Date() } },
    { upsert: true }
  );
  if (r.upsertedCount === 1) return "ok";
  if (r.matchedCount === 1) return "exists";
  return "unconfigured";
}
