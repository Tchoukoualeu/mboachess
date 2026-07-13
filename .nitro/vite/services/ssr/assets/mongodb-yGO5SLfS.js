import { MongoClient } from "mongodb";
const options = {
  serverSelectionTimeoutMS: 1e4
};
let client;
let clientPromise;
function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (clientPromise) return clientPromise;
  {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}
function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}
async function getDb() {
  const p = getClientPromise();
  if (!p) return null;
  const c = await p;
  const name = process.env.MONGODB_DB_NAME || "mboachess";
  return c.db(name);
}
export {
  getDb as g,
  isMongoConfigured as i
};
