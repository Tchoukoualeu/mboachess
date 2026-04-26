import { Db, MongoClient, type MongoClientOptions } from "mongodb";

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 10_000,
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (clientPromise) return clientPromise;
  if (process.env.NODE_ENV === "development") {
    const g = globalThis as typeof globalThis & {
      _mboachess_mongoClient?: Promise<MongoClient>;
    };
    if (!g._mboachess_mongoClient) {
      client = new MongoClient(uri, options);
      g._mboachess_mongoClient = client.connect();
    }
    clientPromise = g._mboachess_mongoClient;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function getDb(): Promise<Db | null> {
  const p = getClientPromise();
  if (!p) return null;
  const c = await p;
  const name = process.env.MONGODB_DB_NAME || "mboachess";
  return c.db(name);
}
