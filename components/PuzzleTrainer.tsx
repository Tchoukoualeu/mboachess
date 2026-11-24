import { Chess, type PieceSymbol, type Square } from "chess.js"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ChessBoard } from "@/components/ChessBoard"
import {
  fill,
  intlLocale,
  translateApiError,
  useDictionary,
  useLocale,
  type Dictionary,
} from "@/lib/i18n"
import { playMoveSound, unlockMoveSounds } from "@/lib/moveSound"
import {
  kingSquare,
  isSquare,
  legalPromotions,
  moveTargets,
  needsPromotion,
  parsePuzzleData,
  playUci,
  preparePuzzle,
  PUZZLE_DIFFICULTIES,
  PUZZLE_THEMES,
  uciOf,
  type PreparedPuzzle,
  type PuzzleDifficultyId,
  type PuzzleThemeId,
} from "@/lib/puzzle"

type Status = "loading" | "setup" | "playing" | "reply" | "solved" | "failed" | "error"
type Tone = "neutral" | "good" | "bad"
type ListedMove = { san: string; byUser: boolean }
type Stats = { solved: number; missed: number; streak: number; bestStreak: number }
type Promotion = { from: Square; to: Square; pieces: PieceSymbol[] }
type Celebration = { clean: boolean; mate: boolean }
type Notice =
  | { kind: "loading"; daily: boolean }
  | { kind: "error"; text: string }
  | { kind: "watch" }
  | { kind: "turn"; san?: string; side: "white" | "black"; check: boolean }
  | { kind: "wrong" }
  | { kind: "best" }
  | { kind: "solution" }
  | { kind: "clean" }
  | { kind: "missed" }

const EMPTY_STATS: Stats = { solved: 0, missed: 0, streak: 0, bestStreak: 0 }
const STATS_KEY = "mboachess.puzzleStats"
const SEEN_KEY = "mboachess.puzzleSeen"
const PUZZLE_ID_RE = /^[A-Za-z0-9]{4,8}$/

const fieldClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"

function noticeText(notice: Notice, dict: Dictionary): string {
  const copy = dict.puzzles
  switch (notice.kind) {
    case "loading":
      return notice.daily ? copy.loadingDaily : copy.loading
    case "error":
      return notice.text
    case "watch":
      return copy.watch
    case "wrong":
      return copy.wrong
    case "best":
      return copy.best
    case "solution":
      return copy.solutionShown
    case "clean":
      return copy.clean
    case "missed":
      return copy.missed
    case "turn": {
      const side = notice.side === "white" ? copy.white : copy.black
      const rest = fill(notice.check ? copy.turnCheck : copy.turn, { side })
      return notice.san ? fill(copy.sanTurn, { san: notice.san, rest }) : rest
    }
  }
}

function turnNotice(chess: Chess, san?: string): Notice {
  return {
    kind: "turn",
    san,
    side: chess.turn() === "w" ? "white" : "black",
    check: chess.isCheck(),
  }
}

function themeName(key: string, dict: Dictionary): string {
  const themes = dict.puzzles.themes
  if (key in themes) return themes[key as keyof typeof themes]
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase())
}

export function PuzzleTrainer() {
  const dict = useDictionary()
  const locale = useLocale()
  const copy = dict.puzzles
  const [theme, setTheme] = useState<PuzzleThemeId>("mix")
  const [difficulty, setDifficulty] = useState<PuzzleDifficultyId>("normal")
  const [status, setStatus] = useState<Status>("loading")
  const [celebration, setCelebration] = useState<Celebration | null>(null)
  const [notice, setNotice] = useState<Notice>({ kind: "loading", daily: false })
  const message = noticeText(notice, dict)
  const [fen, setFen] = useState<string | null>(null)
  const [orientation, setOrientation] = useState<"white" | "black">("white")
  const [turn, setTurn] = useState<"w" | "b">("w")
  const [checkAt, setCheckAt] = useState<Square | null>(null)
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null,
  )
  const [tone, setTone] = useState<Tone>("neutral")
  const [moves, setMoves] = useState<ListedMove[]>([])
  const [selected, setSelected] = useState<Square | null>(null)
  const [targets, setTargets] = useState<Square[]>([])
  const [captures, setCaptures] = useState<Square[]>([])
  const [hint, setHint] = useState(0)
  const [solutionIndex, setSolutionIndex] = useState(0)
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [puzzle, setPuzzle] = useState<PreparedPuzzle | null>(null)
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)
  const [daily, setDaily] = useState(false)

  const chessRef = useRef(new Chess())
  const sessionRef = useRef<PreparedPuzzle | null>(null)
  const indexRef = useRef(0)
  const tokenRef = useRef(0)
  const actionRef = useRef(0)
  const countedRef = useRef(false)
  const mistakesRef = useRef(0)
  const committedFenRef = useRef<string | null>(null)
  const timerRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const filtersRef = useRef({ theme, difficulty })
  filtersRef.current = { theme, difficulty }

  useEffect(() => {
    setStats(readStats())
    function unlock() {
      unlockMoveSounds()
    }
    window.addEventListener("pointerdown", unlock)
    window.addEventListener("keydown", unlock)
    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
    }
  }, [])

  useEffect(() => {
    void loadPuzzle("next")
    return () => {
      tokenRef.current += 1
      actionRef.current += 1
      abortRef.current?.abort()
      clearTimer()
    }
  }, [theme, difficulty])

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function delay(ms: number, token: number, action: number) {
    clearTimer()
    return new Promise<boolean>((resolve) => {
      timerRef.current = window.setTimeout(() => {
        resolve(token === tokenRef.current && action === actionRef.current)
      }, ms)
    })
  }

  function moveCursor(next: number) {
    indexRef.current = next
    setSolutionIndex(next)
  }

  function publish() {
    const chess = chessRef.current
    setFen(chess.fen())
    setTurn(chess.turn())
    setCheckAt(kingSquare(chess))
  }

  function rememberSelection(square: Square | null) {
    setSelected(square)
    if (!square) {
      setTargets([])
      setCaptures([])
      return
    }
    const next = moveTargets(chessRef.current, square)
    setTargets(next.targets)
    setCaptures(next.captures)
  }

  function record(kind: "solved" | "missed", clean: boolean) {
    setStats((prev) => {
      const next = { ...prev }
      if (kind === "solved") {
        next.solved += 1
        if (clean) {
          next.streak += 1
          next.bestStreak = Math.max(next.bestStreak, next.streak)
        } else {
          next.streak = 0
        }
      } else {
        next.missed += 1
        next.streak = 0
      }
      localStorage.setItem(STATS_KEY, JSON.stringify(next))
      return next
    })
  }

  function finishSolved(token: number) {
    if (token !== tokenRef.current) return
    const clean = mistakesRef.current === 0
    const mate = chessRef.current.isCheckmate()
    if (!countedRef.current) {
      countedRef.current = true
      record("solved", clean)
    }
    setCelebration({ clean, mate })
    setStatus("solved")
    setTone("good")
    setNotice(clean ? { kind: "clean" } : { kind: "missed" })
    rememberSelection(null)
  }

  async function loadPuzzle(kind: "next" | "daily") {
    const token = ++tokenRef.current
    actionRef.current += 1
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    clearTimer()
    setDaily(kind === "daily")
    setStatus("loading")
    setCelebration(null)
    setNotice({ kind: "loading", daily: kind === "daily" })
    setPuzzle(null)
    setFen(null)
    setMoves([])
    setLastMove(null)
    setPromotion(null)
    setHint(0)
    rememberSelection(null)
    countedRef.current = false
    mistakesRef.current = 0
    moveCursor(0)

    try {
      const response = await fetch(puzzleRequestUrl(kind, filtersRef.current), {
        signal: controller.signal,
      })
      const body = (await response.json().catch(() => ({}))) as {
        error?: string
      }
      if (token !== tokenRef.current) return
      if (!response.ok) {
        throw new Error(body.error || dict.errors.puzzleLoad)
      }
      const data = parsePuzzleData(body)
      if (!data) throw new Error(dict.errors.puzzleIncomplete)
      const session = preparePuzzle(data)
      if (token !== tokenRef.current) return
      rememberSeen(filtersRef.current, data.id, kind)
      beginSession(session, token)
    } catch (error) {
      if (token !== tokenRef.current) return
      if (error instanceof DOMException && error.name === "AbortError") return
      setStatus("error")
      setNotice({
        kind: "error",
        text: translateApiError(
          error instanceof Error ? error.message : undefined,
          dict,
          dict.errors.puzzleLoad,
        ),
      })
    }
  }

  function beginSession(session: PreparedPuzzle, token: number) {
    sessionRef.current = session
    setPuzzle(session)
    setOrientation(session.orientation)
    const chess = new Chess(session.fenBeforeSetup)
    chessRef.current = chess
    committedFenRef.current = chess.fen()
    moveCursor(0)
    publish()
    setStatus("setup")
    setNotice({ kind: "watch" })
    const action = ++actionRef.current
    void animateSetup(session, token, action)
  }

  async function animateSetup(
    session: PreparedPuzzle,
    token: number,
    action: number,
  ) {
    const ok = await delay(420, token, action)
    if (!ok) return
    const move = chessRef.current.move(session.setup.san)
    playMoveSound(move)
    committedFenRef.current = chessRef.current.fen()
    setMoves([{ san: move.san, byUser: false }])
    setLastMove({ from: move.from, to: move.to })
    setTone("neutral")
    publish()
    setStatus("playing")
    setNotice(turnNotice(chessRef.current, move.san))
  }

  function retry() {
    const session = sessionRef.current
    if (!session || status === "loading") return
    const token = tokenRef.current
    actionRef.current += 1
    clearTimer()
    setCelebration(null)
    setPromotion(null)
    setHint(0)
    setMoves([])
    setLastMove(null)
    mistakesRef.current = 0
    moveCursor(0)
    beginSession(session, token)
  }

  function onSquare(square: Square) {
    if (status !== "playing") return
    if (promotion) {
      setPromotion(null)
    }
    const chess = chessRef.current
    if (selected) {
      const legal = chess
        .moves({ square: selected, verbose: true })
        .some((move) => move.to === square)
      if (legal) {
        void commitMove(selected, square)
        return
      }
    }
    const piece = chess.get(square)
    if (piece && piece.color === chess.turn()) {
      rememberSelection(square)
      return
    }
    rememberSelection(null)
  }

  function onDragMove(from: Square, to: Square) {
    if (status !== "playing") return
    const legal = chessRef.current
      .moves({ square: from, verbose: true })
      .some((move) => move.to === to)
    if (!legal) {
      rememberSelection(null)
      return
    }
    void commitMove(from, to)
  }

  async function commitMove(
    from: Square,
    to: Square,
    promotionPiece?: PieceSymbol,
  ) {
    if (status !== "playing") return
    const session = sessionRef.current
    if (!session) return
    const chess = chessRef.current

    if (!promotionPiece && needsPromotion(chess, from, to)) {
      const pieces = legalPromotions(chess, from, to)
      if (pieces.length === 0) return
      setPromotion({ from, to, pieces })
      rememberSelection(from)
      return
    }

    let move
    try {
      move = chess.move(
        promotionPiece ? { from, to, promotion: promotionPiece } : { from, to },
      )
    } catch {
      return
    }

    setPromotion(null)
    rememberSelection(null)
    playMoveSound(move)
    const expected = session.solution[indexRef.current]
    const played = uciOf(move)
    setLastMove({ from: move.from, to: move.to })
    publish()

    if (played !== expected) {
      mistakesRef.current += 1
      setHint(0)
      setTone("bad")
      setStatus("reply")
      setNotice({ kind: "wrong" })
      const token = tokenRef.current
      const action = actionRef.current
      const ok = await delay(700, token, action)
      if (!ok) return
      if (chessRef.current.fen() !== committedFenRef.current) {
        chessRef.current.undo()
      }
      const history = chessRef.current.history({ verbose: true })
      const previous = history[history.length - 1]
      setTone("neutral")
      setLastMove(previous ? { from: previous.from, to: previous.to } : null)
      publish()
      setStatus("playing")
      setNotice(turnNotice(chessRef.current))
      return
    }

    committedFenRef.current = chess.fen()
    moveCursor(indexRef.current + 1)
    setHint(0)
    setTone("good")
    setMoves((current) => [...current, { san: move.san, byUser: true }])

    if (indexRef.current >= session.solution.length) {
      finishSolved(tokenRef.current)
      return
    }

    setStatus("reply")
    setNotice({ kind: "best" })
    const token = tokenRef.current
    const action = actionRef.current
    const ok = await delay(450, token, action)
    if (!ok) return
    playOpponentReply(token)
  }

  function playOpponentReply(token: number) {
    const session = sessionRef.current
    if (!session || token !== tokenRef.current) return
    const uci = session.solution[indexRef.current]
    if (!uci) {
      finishSolved(token)
      return
    }
    const move = playUci(chessRef.current, uci)
    playMoveSound(move)
    moveCursor(indexRef.current + 1)
    committedFenRef.current = chessRef.current.fen()
    setMoves((current) => [...current, { san: move.san, byUser: false }])
    setLastMove({ from: move.from, to: move.to })
    setTone("neutral")
    publish()
    if (indexRef.current >= session.solution.length) {
      finishSolved(token)
      return
    }
    setStatus("playing")
    setNotice(turnNotice(chessRef.current))
  }

  async function showSolution() {
    const session = sessionRef.current
    if (!session || status === "loading" || status === "setup" || status === "failed") {
      return
    }
    if (status === "solved") return
    const token = tokenRef.current
    const action = ++actionRef.current
    if (!countedRef.current) {
      countedRef.current = true
      record("missed", false)
    }
    if (chessRef.current.fen() !== committedFenRef.current) {
      chessRef.current.undo()
      publish()
    }
    setPromotion(null)
    rememberSelection(null)
    setStatus("reply")
    setNotice({ kind: "solution" })
    setHint(0)

    while (indexRef.current < session.solution.length) {
      const ok = await delay(480, token, action)
      if (!ok) return
      const move = playUci(chessRef.current, session.solution[indexRef.current])
      playMoveSound(move)
      moveCursor(indexRef.current + 1)
      committedFenRef.current = chessRef.current.fen()
      const byUser = move.color === (session.orientation === "white" ? "w" : "b")
      setMoves((current) => [...current, { san: move.san, byUser }])
      setLastMove({ from: move.from, to: move.to })
      setTone("good")
      publish()
    }
    if (token !== tokenRef.current) return
    setStatus("failed")
  }

  function showHint() {
    if (status !== "playing") return
    setHint((current) => Math.min(2, current + 1) as 0 | 1 | 2)
  }

  const hintSquares = currentHintSquares(puzzle, hint, status, solutionIndex)
  const userColor = orientation === "white" ? "white" : "black"
  const opponentColor = orientation === "white" ? "black" : "white"
  const interactive = status === "playing" && !promotion

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-8">
      <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
        <PlayerRow
          player={playerByColor(puzzle, opponentColor, copy)}
          active={turn === (opponentColor === "white" ? "w" : "b") && status !== "loading"}
        />
        <div
          className={`relative my-1.5 ${status === "solved" ? "solve-board" : ""}`}
        >
          <ChessBoard
            fen={fen}
            orientation={orientation}
            interactive={interactive}
            selected={selected}
            targets={targets}
            captures={captures}
            lastMove={lastMove}
            lastTone={tone}
            hintSquares={hintSquares}
            checkSquare={status === "playing" || status === "reply" ? checkAt : null}
            overlay={status === "loading" ? message : null}
            promotion={
              promotion
                ? {
                    pieces: promotion.pieces,
                    color: turn,
                    onChoose: (piece) => {
                      void commitMove(promotion.from, promotion.to, piece)
                    },
                    onCancel: () => setPromotion(null),
                  }
                : null
            }
            onSquare={onSquare}
            onDragMove={onDragMove}
          />
          {status === "solved" && celebration ? (
            <SolveCelebration
              mate={celebration.mate}
              streak={celebration.clean ? stats.streak : 0}
            />
          ) : null}
        </div>
        <PlayerRow
          player={playerByColor(puzzle, userColor, copy)}
          active={turn === (userColor === "white" ? "w" : "b") && status !== "loading"}
          you
        />
      </div>

      <div className="space-y-4">
        <div
          role="status"
          aria-live="polite"
          className={
            status === "solved"
              ? "solve-card rounded-xl border border-brand/40 bg-brand-muted px-4 py-4 text-foreground"
              : `rounded-xl border px-4 py-3 text-sm ${
                  status === "error" || tone === "bad"
                    ? "border-red-400/40 bg-red-500/10 text-foreground"
                    : tone === "good"
                      ? "border-brand/30 bg-brand-muted text-foreground"
                      : "border-border bg-surface text-foreground"
                }`
          }
        >
          {status === "solved" && celebration ? (
            <>
              <p className="font-display text-3xl font-semibold tracking-tight text-brand">
                {celebration.mate ? copy.checkmate : copy.solved}
              </p>
              <p className="mt-1 text-sm">{message}</p>
              {celebration.clean && stats.streak > 1 ? (
                <p className="mt-2 text-sm font-medium">
                  {fill(copy.inARow, { count: stats.streak })}
                </p>
              ) : null}
            </>
          ) : (
            message
          )}
        </div>

        {moves.length > 0 ? (
          <p className="text-sm leading-6 text-ink-muted">
            {moves.map((move, index) => (
              <span
                key={`${move.san}-${index}`}
                className={move.byUser ? "font-semibold text-foreground" : undefined}
              >
                {index > 0 ? " " : ""}
                {move.san}
              </span>
            ))}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={status !== "playing" || hint >= 2}
            onClick={showHint}
          >
            {hint === 0 ? copy.hint : hint === 1 ? copy.hintAgain : copy.hintShown}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={
              !puzzle ||
              status === "loading" ||
              status === "setup" ||
              status === "solved" ||
              status === "failed" ||
              status === "error"
            }
            onClick={() => void showSolution()}
          >
            {copy.solution}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={!puzzle || status === "loading"}
            onClick={retry}
          >
            {copy.retry}
          </button>
          <button
            type="button"
            className={primaryButtonClass}
            disabled={status === "loading"}
            onClick={() => void loadPuzzle("next")}
          >
            {copy.next}
          </button>
        </div>

        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="block text-sm">
            <span className="mb-1 block text-ink-muted">{copy.theme}</span>
            <select
              className={fieldClass}
              value={theme}
              onChange={(event) => setTheme(event.target.value as PuzzleThemeId)}
            >
              {PUZZLE_THEMES.map((item) => (
                <option key={item.id} value={item.id}>
                  {copy.themes[item.id]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-ink-muted">{copy.difficulty}</span>
            <select
              className={fieldClass}
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as PuzzleDifficultyId)
              }
            >
              {PUZZLE_DIFFICULTIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {copy.difficulties[item.id]}
                </option>
              ))}
            </select>
          </label>
        </form>
        <p className="text-xs leading-5 text-ink-muted">
          {copy.filterNote}{" "}
          <button
            type="button"
            className="font-medium text-brand hover:underline disabled:opacity-50"
            disabled={status === "loading"}
            onClick={() => void loadPuzzle("daily")}
          >
            {copy.daily}
          </button>
          {daily ? copy.dailyCurrent : null}
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat
            label={copy.streak}
            value={String(stats.streak)}
            pop={status === "solved" && stats.streak > 0}
          />
          <Stat label={copy.solvedStat} value={String(stats.solved)} />
          <Stat label={copy.missedStat} value={String(stats.missed)} />
        </div>
        <p className="text-xs text-ink-muted">{fill(copy.bestStreak, { count: stats.bestStreak })}</p>

        {puzzle ? (
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-lg font-semibold">
                {fill(copy.rating, { rating: puzzle.rating.toLocaleString(intlLocale(locale)) })}
              </p>
              <p className="text-sm text-ink-muted">
                {fill(copy.plays, { count: puzzle.plays.toLocaleString(intlLocale(locale)) })}
                {puzzle.perf ? ` · ${puzzle.perf}` : ""}
              </p>
            </div>
            {puzzle.themes.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {puzzle.themes.slice(0, 8).map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-brand-muted px-2.5 py-1 text-xs font-medium text-brand"
                  >
                    {themeName(item, dict)}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a
                href={`https://lichess.org/${puzzle.gameId}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline"
              >
                {copy.viewGame}
              </a>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function PlayerRow({
  player,
  active,
  you = false,
}: {
  player: { name: string; rating?: number }
  active: boolean
  you?: boolean
}) {
  const youLabel = useDictionary().puzzles.you
  return (
    <div className="flex items-center gap-2 px-1 py-1 text-sm">
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          active ? "bg-brand" : "bg-border"
        }`}
        aria-hidden
      />
      <span className="truncate font-medium text-foreground">{player.name}</span>
      {player.rating ? (
        <span className="text-ink-muted">{player.rating}</span>
      ) : null}
      {you ? <span className="text-ink-muted">{youLabel}</span> : null}
    </div>
  )
}

function SolveCelebration({ mate, streak }: { mate: boolean; streak: number }) {
  const copy = useDictionary().puzzles
  return (
    <div className="solve-stage pointer-events-none absolute inset-0 z-10" aria-hidden>
      <div className="solve-wash absolute inset-0 rounded-md" />
      {SOLVE_BURST.map((piece) => (
        <span
          key={`${piece.dx}-${piece.dy}-${piece.delay}`}
          className={`solve-piece ${piece.round ? "rounded-full" : "rounded-sm"}`}
          style={
            {
              width: piece.size,
              height: piece.round ? piece.size : `calc(${piece.size} * 0.62)`,
              background: piece.color,
              animationDelay: piece.delay,
              "--dx": piece.dx,
              "--dy": piece.dy,
              "--rot": piece.rot,
            } as CSSProperties
          }
        />
      ))}
      <div className="solve-banner absolute inset-x-0 top-[22%] flex justify-center">
        <div className="rounded-full border border-brand/40 bg-surface px-4 py-1.5 text-center shadow-lg">
          <p className="font-display text-lg font-semibold leading-none text-brand">
            {mate ? copy.checkmate : copy.solved}
          </p>
          {streak > 0 ? (
            <p className="mt-1 text-xs font-medium text-foreground">
              {fill(copy.inARow, { count: streak })}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const SOLVE_BURST = [
  { dx: "-38cqi", dy: "-34cqi", rot: "-28deg", delay: "0ms", size: "0.7rem", color: "var(--brand)", round: false },
  { dx: "34cqi", dy: "-36cqi", rot: "24deg", delay: "40ms", size: "0.55rem", color: "var(--wood)", round: true },
  { dx: "-18cqi", dy: "-42cqi", rot: "12deg", delay: "80ms", size: "0.45rem", color: "var(--brand-soft)", round: true },
  { dx: "16cqi", dy: "-40cqi", rot: "-16deg", delay: "20ms", size: "0.6rem", color: "var(--brand)", round: false },
  { dx: "-42cqi", dy: "-8cqi", rot: "32deg", delay: "60ms", size: "0.5rem", color: "#f3e6c4", round: false },
  { dx: "40cqi", dy: "-6cqi", rot: "-20deg", delay: "100ms", size: "0.65rem", color: "var(--brand)", round: true },
  { dx: "-36cqi", dy: "22cqi", rot: "18deg", delay: "30ms", size: "0.5rem", color: "var(--wood)", round: false },
  { dx: "32cqi", dy: "26cqi", rot: "-30deg", delay: "90ms", size: "0.55rem", color: "var(--brand-soft)", round: true },
  { dx: "-8cqi", dy: "38cqi", rot: "8deg", delay: "50ms", size: "0.45rem", color: "var(--brand)", round: false },
  { dx: "8cqi", dy: "-28cqi", rot: "-8deg", delay: "70ms", size: "0.4rem", color: "#f3e6c4", round: true },
  { dx: "-28cqi", dy: "8cqi", rot: "40deg", delay: "110ms", size: "0.35rem", color: "var(--wood)", round: true },
  { dx: "24cqi", dy: "8cqi", rot: "-36deg", delay: "15ms", size: "0.4rem", color: "var(--brand)", round: false },
  { dx: "0cqi", dy: "-44cqi", rot: "6deg", delay: "120ms", size: "0.5rem", color: "var(--wood)", round: false },
  { dx: "-44cqi", dy: "36cqi", rot: "-14deg", delay: "85ms", size: "0.35rem", color: "#f3e6c4", round: true },
  { dx: "42cqi", dy: "34cqi", rot: "22deg", delay: "45ms", size: "0.45rem", color: "var(--brand-soft)", round: false },
] as const

function Stat({
  label,
  value,
  pop = false,
}: {
  label: string
  value: string
  pop?: boolean
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface px-2 py-2 ${
        pop ? "solve-pop border-brand/40 bg-brand-muted" : ""
      }`}
    >
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="font-display text-xl font-semibold">{value}</p>
    </div>
  )
}

function playerByColor(
  puzzle: PreparedPuzzle | null,
  color: "white" | "black",
  copy: Dictionary["puzzles"],
) {
  const player = puzzle?.players.find((item) => item.color === color)
  return {
    name: player?.name ?? (color === "white" ? copy.white : copy.black),
    rating: player?.rating,
  }
}

function currentHintSquares(
  puzzle: PreparedPuzzle | null,
  hint: number,
  status: Status,
  solutionIndex: number,
): Square[] {
  if (!puzzle || status !== "playing" || hint === 0) return []
  const uci = puzzle.solution[solutionIndex]
  if (!uci) return []
  const from = uci.slice(0, 2)
  const to = uci.slice(2, 4)
  if (!isSquare(from) || !isSquare(to)) return []
  return hint === 1 ? [from] : [from, to]
}

function puzzleRequestUrl(
  kind: "next" | "daily",
  filters: {
    theme: PuzzleThemeId
    difficulty: PuzzleDifficultyId
  },
) {
  const params = new URLSearchParams()
  if (kind === "daily") {
    params.set("daily", "1")
  } else {
    if (filters.theme !== "mix") params.set("angle", filters.theme)
    params.set("difficulty", filters.difficulty)
    const seen = readSeen()[seenKey(filters)] ?? []
    if (seen.length > 0) params.set("exclude", seen.join(","))
  }
  return `/api/puzzle?${params.toString()}`
}

function seenKey(filters: {
  theme: PuzzleThemeId
  difficulty: PuzzleDifficultyId
}) {
  return `${filters.theme}:${filters.difficulty}`
}

function rememberSeen(
  filters: { theme: PuzzleThemeId; difficulty: PuzzleDifficultyId },
  id: string,
  kind: "next" | "daily",
) {
  const key = seenKey(filters)
  const all = readSeen()
  const list = all[key] ?? []
  if (kind === "next" && list.includes(id)) {
    all[key] = [id]
  } else if (!list.includes(id)) {
    all[key] = [...list, id].slice(-400)
  } else {
    return
  }
  localStorage.setItem(SEEN_KEY, JSON.stringify(all))
}

function readSeen(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    const result: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof key !== "string" || key.length > 80 || !Array.isArray(value)) continue
      const ids = value.filter(
        (item): item is string => typeof item === "string" && PUZZLE_ID_RE.test(item),
      )
      if (ids.length > 0) result[key] = ids.slice(-400)
    }
    return result
  } catch {
    return {}
  }
}

function readStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return EMPTY_STATS
    const parsed = JSON.parse(raw) as Partial<Stats>
    return {
      solved: count(parsed.solved),
      missed: count(parsed.missed),
      streak: count(parsed.streak),
      bestStreak: count(parsed.bestStreak),
    }
  } catch {
    return EMPTY_STATS
  }
}

function count(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0
}
