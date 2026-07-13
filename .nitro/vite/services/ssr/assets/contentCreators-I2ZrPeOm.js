import { i as isMongoConfigured, g as getDb } from "./mongodb-yGO5SLfS.js";
const COLLECTION = "contentCreators";
async function getContentCreators() {
  if (!isMongoConfigured()) return [];
  const db = await getDb();
  if (!db) return [];
  const creators = await db.collection(COLLECTION).find({}).sort({ name: 1 }).toArray();
  return creators;
}
async function saveContentCreator(creator) {
  if (!creator.name) return "invalid";
  if (!isMongoConfigured()) return "unconfigured";
  const db = await getDb();
  if (!db) return "unconfigured";
  const col = db.collection(COLLECTION);
  await col.insertOne({
    ...creator,
    createdAt: /* @__PURE__ */ new Date()
  });
  return "ok";
}
export {
  getContentCreators as g,
  saveContentCreator as s
};
