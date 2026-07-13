import { c as createServerRpc } from "./createServerRpc-BIv2m3Zx.js";
import { a4 as createServerFn } from "../server.js";
import { g as getContentCreators } from "./contentCreators-1wRkp1sv.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./mongodb-yGO5SLfS.js";
import "mongodb";
const loadContentCreators_createServerFn_handler = createServerRpc({
  id: "294a222c04dc5ccb27cb2ceb9d4f62d1c45feffa6870b8202173512c283cd9e9",
  name: "loadContentCreators",
  filename: "server/contentCreators.ts"
}, (opts) => loadContentCreators.__executeServer(opts));
const loadContentCreators = createServerFn({
  method: "GET"
}).handler(loadContentCreators_createServerFn_handler, async () => getContentCreators());
export {
  loadContentCreators_createServerFn_handler
};
