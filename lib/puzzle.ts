import { Chess, type Move, type PieceSymbol, type Square } from "chess.js"

export const PUZZLE_THEMES = [
  { id: "mix", label: "Mixed" },
  { id: "opening", label: "Opening" },
  { id: "middlegame", label: "Middlegame" },
  { id: "endgame", label: "Endgame" },
  { id: "mate", label: "Checkmate" },
  { id: "mateIn1", label: "Mate in 1" },
  { id: "mateIn2", label: "Mate in 2" },
  { id: "fork", label: "Fork" },
  { id: "pin", label: "Pin" },
  { id: "skewer", label: "Skewer" },
  { id: "discoveredAttack", label: "Discovered attack" },
  { id: "sacrifice", label: "Sacrifice" },
  { id: "hangingPiece", label: "Hanging piece" },
  { id: "trappedPiece", label: "Trapped piece" },
  { id: "backRankMate", label: "Back rank mate" },
  { id: "promotion", label: "Promotion" },
  { id: "kingsideAttack", label: "Kingside attack" },
  { id: "queensideAttack", label: "Queenside attack" },
  { id: "defensiveMove", label: "Defensive move" },
  { id: "crushing", label: "Crushing" },
  { id: "advantage", label: "Advantage" },
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "master", label: "Master games" },
] as const

export const PUZZLE_DIFFICULTIES = [
  { id: "easiest", label: "Easiest" },
  { id: "easier", label: "Easier" },
  { id: "normal", label: "Normal" },
  { id: "harder", label: "Harder" },
  { id: "hardest", label: "Hardest" },
] as const

export const PUZZLE_COLORS = [
  { id: "", label: "Either color" },
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
] as const

export type PuzzleThemeId = (typeof PUZZLE_THEMES)[number]["id"]
export type PuzzleDifficultyId = (typeof PUZZLE_DIFFICULTIES)[number]["id"]
export type PuzzleColorId = (typeof PUZZLE_COLORS)[number]["id"]

const THEME_LABELS: Record<string, string> = {
  mateIn3: "Mate in 3",
  mateIn4: "Mate in 4",
  veryLong: "Very long",
  oneMove: "One move",
  exposedKing: "Exposed king",
  advancedPawn: "Advanced pawn",
  quietMove: "Quiet move",
  rookEndgame: "Rook endgame",
  pawnEndgame: "Pawn endgame",
  bishopEndgame: "Bishop endgame",
  knightEndgame: "Knight endgame",
  queenEndgame: "Queen endgame",
  smotheredMate: "Smothered mate",
  equality: "Equality",
  attraction: "Attraction",
  deflection: "Deflection",
  clearance: "Clearance",
  interference: "Interference",
  intermezzo: "Intermezzo",
  xRayAttack: "X-ray attack",
  doubleCheck: "Double check",
  castling: "Castling",
  enPassant: "En passant",
  underPromotion: "Underpromotion",
  masterVsMaster: "Master vs master",
  superGM: "Super GM",
}

for (const theme of PUZZLE_THEMES) {
  THEME_LABELS[theme.id] = theme.label
}

const UCI_RE = /^[a-h][1-8][a-h][1-8][qrbn]?$/
const SQUARE_RE = /^[a-h][1-8]$/

export type PuzzlePlayer = {
  name: string
  color: "white" | "black"
  rating?: number
}

export type PuzzleData = {
  game: {
    id: string
    perf?: string
    players: PuzzlePlayer[]
    pgn: string
  }
  puzzle: {
    id: string
    rating: number
    plays: number
    initialPly: number
    solution: string[]
    themes: string[]
  }
}

export type PreparedPuzzle = {
  id: string
  rating: number
  plays: number
  themes: string[]
  solution: string[]
  gameId: string
  perf?: string
  players: PuzzlePlayer[]
  /** Position before the opponent's setup move. */
  fenBeforeSetup: string
  setup: { san: string; from: Square; to: Square }
  /** Side the solver plays, placed at the bottom of the board. */
  orientation: "white" | "black"
}

export function themeLabel(key: string) {
  return (
    THEME_LABELS[key] ??
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (char) => char.toUpperCase())
  )
}

export function isPuzzleTheme(value: string): value is PuzzleThemeId {
  return PUZZLE_THEMES.some((theme) => theme.id === value)
}

export function isPuzzleDifficulty(
  value: string,
): value is PuzzleDifficultyId {
  return PUZZLE_DIFFICULTIES.some((item) => item.id === value)
}

export function isSquare(value: string): value is Square {
  return SQUARE_RE.test(value)
}

export function parsePuzzleData(value: unknown): PuzzleData | null {
  if (!value || typeof value !== "object") return null
  const data = value as Record<string, unknown>
  const game = data.game
  const puzzle = data.puzzle
  if (!game || typeof game !== "object" || !puzzle || typeof puzzle !== "object") {
    return null
  }

  const gameRecord = game as Record<string, unknown>
  const puzzleRecord = puzzle as Record<string, unknown>
  if (typeof gameRecord.id !== "string" || typeof gameRecord.pgn !== "string") {
    return null
  }
  if (!Array.isArray(gameRecord.players)) return null

  const players: PuzzlePlayer[] = []
  for (const player of gameRecord.players) {
    const parsed = parsePlayer(player)
    if (parsed) players.push(parsed)
  }
  if (!players.some((player) => player.color === "white")) return null
  if (!players.some((player) => player.color === "black")) return null

  if (typeof puzzleRecord.id !== "string" || !puzzleRecord.id.trim()) return null
  if (typeof puzzleRecord.rating !== "number" || !Number.isFinite(puzzleRecord.rating)) {
    return null
  }
  if (typeof puzzleRecord.plays !== "number" || !Number.isFinite(puzzleRecord.plays)) {
    return null
  }
  if (
    typeof puzzleRecord.initialPly !== "number" ||
    !Number.isInteger(puzzleRecord.initialPly) ||
    puzzleRecord.initialPly < 0 ||
    puzzleRecord.initialPly > 600
  ) {
    return null
  }
  if (!Array.isArray(puzzleRecord.solution) || puzzleRecord.solution.length === 0) {
    return null
  }
  if (puzzleRecord.solution.length > 40) return null
  const solution: string[] = []
  for (const move of puzzleRecord.solution) {
    if (typeof move !== "string" || !UCI_RE.test(move)) return null
    solution.push(move)
  }
  const themes = Array.isArray(puzzleRecord.themes)
    ? puzzleRecord.themes.filter((theme): theme is string => typeof theme === "string")
    : []

  const perfRecord = gameRecord.perf
  const perf =
    perfRecord &&
    typeof perfRecord === "object" &&
    typeof (perfRecord as { name?: unknown }).name === "string"
      ? (perfRecord as { name: string }).name
      : undefined

  return {
    game: {
      id: gameRecord.id,
      perf,
      players,
      pgn: gameRecord.pgn,
    },
    puzzle: {
      id: puzzleRecord.id,
      rating: puzzleRecord.rating,
      plays: puzzleRecord.plays,
      initialPly: puzzleRecord.initialPly,
      solution,
      themes,
    },
  }
}

/**
 * Lichess `initialPly` is the position before the opponent's setup move.
 * That move is the next ply in the game PGN. `solution` starts with the
 * solver's move and then alternates with the opponent's replies.
 */
export function preparePuzzle(data: PuzzleData): PreparedPuzzle {
  const replay = new Chess()
  try {
    replay.loadPgn(data.game.pgn)
  } catch {
    throw new Error("Could not read this puzzle.")
  }

  const history = replay.history({ verbose: true })
  const setup = history[data.puzzle.initialPly]
  if (!setup) throw new Error("This puzzle's position is missing.")

  const chess = new Chess()
  try {
    for (let i = 0; i < data.puzzle.initialPly; i++) {
      chess.move(history[i].san)
    }
  } catch {
    throw new Error("Could not reach this puzzle's position.")
  }

  const fenBeforeSetup = chess.fen()
  try {
    chess.move(setup.san)
    for (const uci of data.puzzle.solution) playUci(chess, uci)
  } catch {
    throw new Error("This puzzle's solution could not be replayed.")
  }

  return {
    id: data.puzzle.id,
    rating: data.puzzle.rating,
    plays: data.puzzle.plays,
    themes: data.puzzle.themes,
    solution: data.puzzle.solution,
    gameId: data.game.id,
    perf: data.game.perf,
    players: data.game.players,
    fenBeforeSetup,
    setup: { san: setup.san, from: setup.from, to: setup.to },
    orientation: setup.color === "w" ? "black" : "white",
  }
}

export function playUci(chess: Chess, uci: string): Move {
  const from = uci.slice(0, 2)
  const to = uci.slice(2, 4)
  const promotion = uci.length > 4 ? uci[4] : undefined
  if (!isSquare(from) || !isSquare(to)) {
    throw new Error("Invalid move in puzzle solution.")
  }
  return chess.move(promotion ? { from, to, promotion } : { from, to })
}

export function needsPromotion(chess: Chess, from: Square, to: Square) {
  const piece = chess.get(from)
  if (!piece || piece.type !== "p") return false
  return (
    (piece.color === "w" && to[1] === "8") ||
    (piece.color === "b" && to[1] === "1")
  )
}

export function legalPromotions(
  chess: Chess,
  from: Square,
  to: Square,
): PieceSymbol[] {
  const order: PieceSymbol[] = ["q", "r", "b", "n"]
  const available = new Set(
    chess
      .moves({ square: from, verbose: true })
      .filter((move) => move.to === to && move.promotion)
      .map((move) => move.promotion as PieceSymbol),
  )
  return order.filter((piece) => available.has(piece))
}

export function moveTargets(chess: Chess, from: Square) {
  const moves = chess.moves({ square: from, verbose: true })
  return {
    targets: moves.map((move) => move.to),
    captures: moves.filter((move) => move.isCapture()).map((move) => move.to),
  }
}

export function uciOf(move: { from: string; to: string; promotion?: string }) {
  return `${move.from}${move.to}${move.promotion ?? ""}`
}

export function kingSquare(chess: Chess): Square | null {
  if (!chess.isCheck()) return null
  const color = chess.turn()
  for (const rank of chess.board()) {
    for (const piece of rank) {
      if (piece && piece.type === "k" && piece.color === color) return piece.square
    }
  }
  return null
}

function parsePlayer(value: unknown): PuzzlePlayer | null {
  if (!value || typeof value !== "object") return null
  const player = value as Record<string, unknown>
  if (player.color !== "white" && player.color !== "black") return null
  const fallback = player.color === "white" ? "White" : "Black"
  const name =
    typeof player.name === "string" && player.name.trim()
      ? player.name.trim()
      : fallback
  const rating =
    typeof player.rating === "number" && Number.isFinite(player.rating)
      ? player.rating
      : undefined
  return { name, color: player.color, rating }
}
