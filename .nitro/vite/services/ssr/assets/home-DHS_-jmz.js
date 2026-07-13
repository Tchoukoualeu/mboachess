import { c as createServerRpc } from "./createServerRpc-BIv2m3Zx.js";
import { a4 as createServerFn } from "../server.js";
import { g as getSubmittedUsernames } from "./chesscomUsernames-D6JZLzLJ.js";
import { f as fetchPlayerSnapshot } from "./chesscom-D1rMt3aW.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./mongodb-yGO5SLfS.js";
import "mongodb";
function topByRating(rows, mode) {
  const withRating = rows.filter(
    (r) => !r.error && typeof r[mode] === "number" && r[mode] > 0
  );
  if (withRating.length === 0) return null;
  return withRating.reduce((best, r) => {
    const a = r[mode];
    const b = best[mode];
    if (a > b) return r;
    if (a < b) return best;
    return r.username.toLowerCase() < best.username.toLowerCase() ? r : best;
  });
}
const TRACKED_USERNAMES = ["menxele", "brlliantmoves", "aris2021222324", "amicodi1pelato", "open2doorwithin"];
function uniqueSortedUsernames(a, b) {
  return [.../* @__PURE__ */ new Set([...a, ...b])].sort((x, y) => x.localeCompare(y));
}
function sortByRapidDesc(rows) {
  rows.sort((a, b) => {
    const aNum = typeof a.rapid === "number" ? a.rapid : Number.NEGATIVE_INFINITY;
    const bNum = typeof b.rapid === "number" ? b.rapid : Number.NEGATIVE_INFINITY;
    if (bNum !== aNum) return bNum - aNum;
    return a.username.localeCompare(b.username, void 0, {
      sensitivity: "base"
    });
  });
}
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }
  const workers = Array.from({
    length: Math.min(limit, items.length)
  }, worker);
  await Promise.all(workers);
  return results;
}
const FETCH_CONCURRENCY = 6;
const CACHE_TTL_MS = 6e4;
let cache = null;
const loadHomeData_createServerFn_handler = createServerRpc({
  id: "478496646ceea7bd195c647ef46aa47bbd45720a47d199d1367f3b613a1db6ff",
  name: "loadHomeData",
  filename: "server/home.ts"
}, (opts) => loadHomeData.__executeServer(opts));
const loadHomeData = createServerFn({
  method: "GET"
}).handler(loadHomeData_createServerFn_handler, async () => {
  const fromDb = await getSubmittedUsernames();
  const usernames = uniqueSortedUsernames(TRACKED_USERNAMES, fromDb);
  const key = usernames.join(",");
  const now = Date.now();
  if (cache && cache.key === key && now - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }
  const rows = await mapWithConcurrency(usernames, FETCH_CONCURRENCY, fetchPlayerSnapshot);
  sortByRapidDesc(rows);
  const data = {
    rows,
    blitzLeader: topByRating(rows, "blitz"),
    rapidLeader: topByRating(rows, "rapid")
  };
  cache = {
    key,
    at: now,
    data
  };
  return data;
});
export {
  loadHomeData_createServerFn_handler
};
