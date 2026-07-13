import { c as createServerRpc } from "./createServerRpc-BIv2m3Zx.js";
import { a4 as createServerFn } from "../server.js";
import { g as getTournaments } from "./tournaments-Ijxn2pDm.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./mongodb-BSnNLwqh.js";
import "timers/promises";
import "timers";
import "fs";
import "http";
import "process";
import "events";
import "dns";
import "url";
import "zlib";
import "net";
import "fs/promises";
import "tls";
import "child_process";
const loadTournaments_createServerFn_handler = createServerRpc({
  id: "fdff08ca78a27acc5cf8d91fae3be87452758cb92fa0f0f89c91da6180a75eeb",
  name: "loadTournaments",
  filename: "server/tournaments.ts"
}, (opts) => loadTournaments.__executeServer(opts));
const loadTournaments = createServerFn({
  method: "GET"
}).handler(loadTournaments_createServerFn_handler, async () => getTournaments());
export {
  loadTournaments_createServerFn_handler
};
