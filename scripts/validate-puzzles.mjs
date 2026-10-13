import { Chess } from "chess.js"
import { readFileSync, writeFileSync } from "node:fs"

const path = process.argv[2] ?? "server/puzzleData.ts"
const source = readFileSync(path, "utf8")
const start = source.indexOf("[")
const end = source.lastIndexOf("]")
if (start < 0 || end < start) throw new Error("Could not read puzzle rows")
const rows = JSON.parse(source.slice(start, end + 1))
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

const lines = kept.map((row) => JSON.stringify(row))
writeFileSync(path, `export const puzzleRows = [\n${lines.join(",\n")}\n] as const\n`)
console.error(`kept ${kept.length}, dropped ${dropped}`)
