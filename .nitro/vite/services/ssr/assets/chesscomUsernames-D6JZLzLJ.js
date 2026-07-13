import { i as isMongoConfigured, g as getDb } from "./mongodb-yGO5SLfS.js";
const COLLECTION = "player_usernames";
function normalizeChesscomUsername(input) {
  const s = input.trim().replace(/^@/, "").toLowerCase();
  if (!s) return null;
  if (!/^[a-z0-9_-]{1,50}$/i.test(s)) return null;
  return s;
}
async function getSubmittedUsernames() {
  if (!isMongoConfigured()) return [];
  const db = await getDb();
  if (!db) return [];
  const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => d.username);
}
async function saveUsername(raw) {
  const username = normalizeChesscomUsername(raw);
  if (!username) return "invalid";
  if (!isMongoConfigured()) return "unconfigured";
  const db = await getDb();
  if (!db) return "unconfigured";
  const col = db.collection(COLLECTION);
  const r = await col.updateOne(
    { username },
    { $setOnInsert: { username, createdAt: /* @__PURE__ */ new Date() } },
    { upsert: true }
  );
  if (r.upsertedCount === 1) return "ok";
  if (r.matchedCount === 1) return "exists";
  return "unconfigured";
}
export {
  getSubmittedUsernames as g,
  normalizeChesscomUsername as n,
  saveUsername as s
};
