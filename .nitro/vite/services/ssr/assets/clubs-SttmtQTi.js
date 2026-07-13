import { i as isMongoConfigured, g as getDb } from "./mongodb-yGO5SLfS.js";
const COLLECTION = "clubs";
async function getClubs() {
  if (!isMongoConfigured()) return [];
  const db = await getDb();
  if (!db) return [];
  const clubs = await db.collection(COLLECTION).find({}).sort({ name: 1 }).toArray();
  return clubs;
}
async function saveClub(club) {
  if (!club.name) return "invalid";
  if (!isMongoConfigured()) return "unconfigured";
  const db = await getDb();
  if (!db) return "unconfigured";
  const col = db.collection(COLLECTION);
  await col.insertOne({
    ...club,
    createdAt: /* @__PURE__ */ new Date()
  });
  return "ok";
}
export {
  getClubs as g,
  saveClub as s
};
