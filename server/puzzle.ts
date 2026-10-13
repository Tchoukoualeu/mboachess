import {
  isPuzzleDifficulty,
  isPuzzleTheme,
  parsePuzzleData,
  type PuzzleColorId,
  type PuzzleData,
  type PuzzleDifficultyId,
  type PuzzleThemeId,
} from "@/lib/puzzle"

const LICHESS_PUZZLE = "https://lichess.org/api/puzzle"
const USER_AGENT = "mboachess.com (https://mboachess.com)"

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

export async function fetchPuzzle(request: PuzzleRequest): Promise<PuzzleData> {
  const url = puzzleUrl(request)
  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
    })
  } catch {
    throw new PuzzleQueryError(
      "Could not reach Lichess. Check your connection and try again.",
      502,
    )
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new PuzzleQueryError(
        "No puzzle matched that filter. Try another theme.",
        404,
      )
    }
    if (response.status === 429) {
      throw new PuzzleQueryError(
        "Lichess is rate-limiting puzzle requests. Wait a moment and try again.",
        429,
      )
    }
    throw new PuzzleQueryError("Lichess could not provide a puzzle.", 502)
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new PuzzleQueryError("Lichess returned an unreadable puzzle.", 502)
  }

  const puzzle = parsePuzzleData(body)
  if (!puzzle) {
    throw new PuzzleQueryError("Lichess returned an unexpected puzzle.", 502)
  }
  return puzzle
}

function puzzleUrl(request: PuzzleRequest) {
  if (request.id) {
    if (!/^[A-Za-z0-9]{4,8}$/.test(request.id)) {
      throw new PuzzleQueryError("Unknown puzzle.")
    }
    return `${LICHESS_PUZZLE}/${request.id}`
  }

  if (request.daily) return `${LICHESS_PUZZLE}/daily`

  const params = new URLSearchParams()
  if (request.angle && request.angle !== "mix") {
    if (!isPuzzleTheme(request.angle)) {
      throw new PuzzleQueryError("Unknown theme.")
    }
    params.set("angle", request.angle satisfies PuzzleThemeId)
  }
  if (request.difficulty) {
    if (!isPuzzleDifficulty(request.difficulty)) {
      throw new PuzzleQueryError("Unknown difficulty.")
    }
    params.set("difficulty", request.difficulty satisfies PuzzleDifficultyId)
  }
  if (request.color) {
    if (request.color !== "white" && request.color !== "black") {
      throw new PuzzleQueryError("Unknown color.")
    }
    params.set("color", request.color satisfies Exclude<PuzzleColorId, "">)
  }

  const query = params.toString()
  return query ? `${LICHESS_PUZZLE}/next?${query}` : `${LICHESS_PUZZLE}/next`
}
