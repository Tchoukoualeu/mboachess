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
  const rows = [];
  for (const u of usernames) {
    rows.push(await fetchPlayerSnapshot(u));
    await new Promise((r) => setTimeout(r, 120));
  }
  sortByRapidDesc(rows);
  return {
    rows,
    blitzLeader: topByRating(rows, "blitz"),
    rapidLeader: topByRating(rows, "rapid")
  };
});
export {
  loadHomeData_createServerFn_handler
};
