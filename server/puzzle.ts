import rawPuzzles from "@/data/puzzles.json"
import {
  isPuzzleDifficulty,
  isPuzzleTheme,
  type PuzzleData,
  type PuzzleDifficultyId,
} from "@/lib/puzzle"

/**
 * Compact rows extracted from the public Lichess puzzle database:
 * [id, rating, plays, gameId, solver color, themes, fen, uci moves]
 */
type PuzzleRow = [
  string,
  number,
  number,
  string,
  "w" | "b",
  string,
  string,
  string,
]

type StoredPuzzle = {
  id: string
  rating: number
  plays: number
  gameId: string
  color: "w" | "b"
  themes: string[]
  fen: string
  moves: string[]
}

const RATING_DELTA: Record<PuzzleDifficultyId, number> = {
  easiest: -600,
  easier: -300,
  normal: 0,
  harder: 300,
  hardest: 600,
}

const puzzles: StoredPuzzle[] = (rawPuzzles as PuzzleRow[]).map((row) => ({
  id: row[0],
  rating: row[1],
  plays: row[2],
  gameId: row[3],
  color: row[4],
  themes: row[5] ? row[5].split(" ") : [],
  fen: row[6],
  moves: row[7].split(" "),
}))

const byId = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]))
const byTheme = new Map<string, StoredPuzzle[]>()
for (const puzzle of puzzles) {
  for (const theme of puzzle.themes) {
    const list = byTheme.get(theme)
    if (list) list.push(puzzle)
    else byTheme.set(theme, [puzzle])
  }
}

export class PuzzleQueryError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = "PuzzleQueryError"
    this.status = status
  }
}

export type PuzzleRequest = {
  daily?: boolean
  id?: string
  angle?: string
  difficulty?: string
  color?: string
}

export function fetchPuzzle(request: PuzzleRequest): PuzzleData {
  if (request.id) {
    if (!/^[A-Za-z0-9]{4,8}$/.test(request.id)) {
      throw new PuzzleQueryError("Unknown puzzle.")
    }
    const puzzle = byId.get(request.id)
    if (!puzzle) throw new PuzzleQueryError("Unknown puzzle.", 404)
    return toData(puzzle)
  }

  if (request.daily) {
    const dailyPool = puzzles.filter(
      (puzzle) => puzzle.rating >= 1300 && puzzle.rating <= 1700,
    )
    const pool = dailyPool.length > 0 ? dailyPool : puzzles
    return toData(pool[dailyIndex(pool.length)])
  }

  const theme = request.angle && request.angle !== "mix" ? request.angle : undefined
  if (theme && !isPuzzleTheme(theme)) {
    throw new PuzzleQueryError("Unknown theme.")
  }
  const difficulty = request.difficulty ?? "normal"
  if (!isPuzzleDifficulty(difficulty)) {
    throw new PuzzleQueryError("Unknown difficulty.")
  }
  if (
    request.color &&
    request.color !== "white" &&
    request.color !== "black"
  ) {
    throw new PuzzleQueryError("Unknown color.")
  }

  let pool = theme ? (byTheme.get(theme) ?? []) : puzzles
  if (request.color) {
    const color = request.color === "white" ? "w" : "b"
    pool = pool.filter((puzzle) => puzzle.color === color)
  }
  if (pool.length === 0) {
    throw new PuzzleQueryError(
      "No puzzle matched that filter. Try another theme.",
      404,
    )
  }

  for (const slack of [0, 250, 500, 1000]) {
    const matches = pool.filter((puzzle) =>
      inRatingWindow(puzzle.rating, difficulty, slack),
    )
    if (matches.length > 0) return toData(pick(matches))
  }

  return toData(pick(pool))
}

function inRatingWindow(
  rating: number,
  difficulty: PuzzleDifficultyId,
  slack: number,
) {
  const target = 1500 + RATING_DELTA[difficulty]
  return rating >= target - 200 - slack && rating <= target + 200 + slack
}

function pick(pool: StoredPuzzle[]) {
  return pool[Math.floor(Math.random() * pool.length)]
}

function dailyIndex(size: number) {
  const day = new Date().toISOString().slice(0, 10)
  let hash = 0
  for (let i = 0; i < day.length; i++) {
    hash = (Math.imul(hash, 33) + day.charCodeAt(i)) >>> 0
  }
  return hash % size
}

function toData(puzzle: StoredPuzzle): PuzzleData {
  return {
    id: puzzle.id,
    rating: puzzle.rating,
    plays: puzzle.plays,
    themes: puzzle.themes,
    gameId: puzzle.gameId,
    fen: puzzle.fen,
    moves: puzzle.moves,
  }
}
