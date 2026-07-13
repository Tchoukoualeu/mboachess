import { c as createServerRpc } from "./createServerRpc-BIv2m3Zx.js";
import { a4 as createServerFn } from "../server.js";
import { g as getClubs } from "./clubs-BYYazxhC.js";
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
const loadClubs_createServerFn_handler = createServerRpc({
  id: "a30f3410c46a25cb7f7e241b4fa9cc3bdaf8cd8d0ecc4ab5c03f469951f2630c",
  name: "loadClubs",
  filename: "server/clubs.ts"
}, (opts) => loadClubs.__executeServer(opts));
const loadClubs = createServerFn({
  method: "GET"
}).handler(loadClubs_createServerFn_handler, async () => getClubs());
export {
  loadClubs_createServerFn_handler
};
