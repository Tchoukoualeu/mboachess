import { Chess } from "chess.js"
import { readFileSync, writeFileSync } from "node:fs"

const path = process.argv[2]
const rows = JSON.parse(readFileSync(path, "utf8"))
const kept = []
let dropped = 0

for (const row of rows) {
  try {
    const chess = new Chess(row[6])
    for (const uci of row[7].split(" ")) {
      const move = chess.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4],
      })
      if (!move) throw new Error("illegal")
    }
    kept.push(row)
  } catch {
    dropped += 1
  }
}

writeFileSync(path, `${JSON.stringify(kept)}\n`)
console.error(`kept ${kept.length}, dropped ${dropped}`)
