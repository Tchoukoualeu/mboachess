import { Chess, type Color, type PieceSymbol, type Square } from "chess.js"
import { useEffect, useMemo, useRef, useState } from "react"
import { isSquare, moveTargets } from "@/lib/puzzle"

const LIGHT = "#f0d9b5"
const DARK = "#b58863"
const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
}
const UNICODE: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
}

type LastMove = { from: Square; to: Square }
type BoardMark = { from: Square; to: Square }

type ChessBoardProps = {
  fen: string | null
  orientation: "white" | "black"
  interactive: boolean
  selected: Square | null
  targets: Square[]
  captures: Square[]
  lastMove: LastMove | null
  lastTone: "neutral" | "good" | "bad"
  hintSquares: Square[]
  checkSquare: Square | null
  overlay?: string | null
  promotion?: {
    pieces: PieceSymbol[]
    color: Color
    onChoose: (piece: PieceSymbol) => void
    onCancel: () => void
  } | null
  onSquare: (square: Square) => void
  onDragMove: (from: Square, to: Square) => void
}

export function ChessBoard({
  fen,
  orientation,
  interactive,
  selected,
  targets,
  captures,
  lastMove,
  lastTone,
  hintSquares,
  checkSquare,
  overlay,
  promotion,
  onSquare,
  onDragMove,
}: ChessBoardProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    from: Square
    pointerId: number
    startX: number
    startY: number
    moved: boolean
  } | null>(null)
  const drawRef = useRef<{
    from: Square
    pointerId: number
    startX: number
    startY: number
    moved: boolean
  } | null>(null)
  const suppressClick = useRef(false)
  const [marks, setMarks] = useState<BoardMark[]>([])
  const [draft, setDraft] = useState<BoardMark | null>(null)
  const [dragFrom, setDragFrom] = useState<Square | null>(null)
  const [ghost, setGhost] = useState<{
    x: number
    y: number
    color: Color
    type: PieceSymbol
  } | null>(null)

  const position = useMemo(() => {
    if (!fen) return null
    try {
      return new Chess(fen)
    } catch {
      return null
    }
  }, [fen])

  const dragMoves = useMemo(() => {
    if (!position || !dragFrom) return { targets: [] as Square[], captures: [] as Square[] }
    return moveTargets(position, dragFrom)
  }, [position, dragFrom])

  const activeTargets = dragFrom ? dragMoves.targets : targets
  const activeCaptures = new Set(dragFrom ? dragMoves.captures : captures)
  const files = orientation === "white" ? "abcdefgh" : "hgfedcba"
  const ranks = orientation === "white" ? "87654321" : "12345678"

  useEffect(() => {
    setMarks([])
    setDraft(null)
  }, [fen])

  useEffect(() => {
    if (!promotion) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") promotion?.onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [promotion])

  function squareFromClient(clientX: number, clientY: number): Square | null {
    const grid = gridRef.current
    if (!grid) return null
    const rect = grid.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null
    const fileIndex = Math.min(7, Math.floor((x / rect.width) * 8))
    const rankIndex = Math.min(7, Math.floor((y / rect.height) * 8))
    const square = `${files[fileIndex]}${ranks[rankIndex]}`
    return isSquare(square) ? square : null
  }

  function endDrag() {
    dragRef.current = null
    drawRef.current = null
    setDragFrom(null)
    setGhost(null)
    setDraft(null)
  }

  function toggleMark(from: Square, to: Square) {
    setMarks((current) => {
      const exists = current.some((mark) => mark.from === from && mark.to === to)
      if (exists) return current.filter((mark) => mark.from !== from || mark.to !== to)
      return [...current, { from, to }]
    })
  }

  return (
    <div className="relative rounded-xl border-4 border-wood bg-wood p-1 shadow-md">
      <div
        ref={gridRef}
        role="grid"
        aria-label="Chess board"
        className="grid aspect-square w-full grid-cols-8 grid-rows-8 overflow-hidden rounded-md touch-none select-none"
        onContextMenu={(event) => event.preventDefault()}
        onAuxClick={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.button === 0 && !event.ctrlKey) {
            setMarks((current) => (current.length === 0 ? current : []))
            return
          }
          if (event.button !== 2 && !(event.button === 0 && event.ctrlKey)) return
          event.preventDefault()
          const from = squareFromClient(event.clientX, event.clientY)
          if (!from) return
          drawRef.current = {
            from,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            moved: false,
          }
          setDraft({ from, to: from })
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const draw = drawRef.current
          if (draw && event.pointerId === draw.pointerId) {
            const distance = Math.hypot(
              event.clientX - draw.startX,
              event.clientY - draw.startY,
            )
            if (distance >= 6) draw.moved = true
            const to = squareFromClient(event.clientX, event.clientY) ?? draw.from
            setDraft({ from: draw.from, to })
            return
          }
          const drag = dragRef.current
          if (!drag || event.pointerId !== drag.pointerId) return
          const distance = Math.hypot(
            event.clientX - drag.startX,
            event.clientY - drag.startY,
          )
          if (distance < 6) return
          drag.moved = true
          const piece = position?.get(drag.from)
          if (!piece) return
          setDragFrom(drag.from)
          setGhost({
            x: event.clientX,
            y: event.clientY,
            color: piece.color,
            type: piece.type,
          })
        }}
        onPointerUp={(event) => {
          const draw = drawRef.current
          if (draw && event.pointerId === draw.pointerId) {
            const from = draw.from
            const moved = draw.moved
            const to = squareFromClient(event.clientX, event.clientY)
            drawRef.current = null
            setDraft(null)
            if (!moved || !to || to === from) toggleMark(from, from)
            else toggleMark(from, to)
            return
          }
          const drag = dragRef.current
          if (!drag || event.pointerId !== drag.pointerId) return
          const from = drag.from
          const moved = drag.moved
          const to = squareFromClient(event.clientX, event.clientY)
          endDrag()
          if (moved) {
            suppressClick.current = true
            if (to && to !== from) onDragMove(from, to)
          }
        }}
        onPointerCancel={endDrag}
      >
        {ranks.split("").map((rank, rankIndex) =>
          files.split("").map((file, fileIndex) => {
            const square = `${file}${rank}` as Square
            const piece = position?.get(square) ?? null
            const isDark = (fileIndex + rankIndex) % 2 === 1
            const isLast =
              lastMove?.from === square || lastMove?.to === square
            const isSelected = selected === square || dragFrom === square
            const isTarget = activeTargets.includes(square)
            const isHint = hintSquares.includes(square)
            const isCheck = checkSquare === square
            const highlight = isSelected
              ? "rgba(255, 230, 80, 0.55)"
              : isLast
                ? lastTone === "good"
                  ? "rgba(46, 160, 80, 0.5)"
                  : lastTone === "bad"
                    ? "rgba(220, 60, 60, 0.5)"
                    : "rgba(255, 230, 80, 0.45)"
                : null

            return (
              <button
                key={square}
                type="button"
                role="gridcell"
                aria-label={squareLabel(square, piece)}
                aria-pressed={isSelected}
                className="relative flex items-center justify-center"
                style={{ backgroundColor: isDark ? DARK : LIGHT }}
                onPointerDown={(event) => {
                  if (!interactive || event.button !== 0 || event.ctrlKey || !piece) return
                  const turn = position?.turn()
                  if (!turn || piece.color !== turn) return
                  dragRef.current = {
                    from: square,
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY,
                    moved: false,
                  }
                  event.currentTarget.setPointerCapture(event.pointerId)
                }}
                onClick={() => {
                  if (suppressClick.current) {
                    suppressClick.current = false
                    return
                  }
                  if (!interactive) return
                  onSquare(square)
                }}
              >
                {highlight ? (
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{ backgroundColor: highlight }}
                  />
                ) : null}
                {isCheck ? (
                  <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.7)_0%,rgba(220,38,38,0.18)_58%,transparent_72%)]" />
                ) : null}
                {isHint ? (
                  <span className="pointer-events-none absolute inset-1 rounded-sm ring-2 ring-inset ring-brand" />
                ) : null}
                {isTarget && !activeCaptures.has(square) ? (
                  <span className="pointer-events-none absolute h-[28%] w-[28%] rounded-full bg-black/25" />
                ) : null}
                {isTarget && activeCaptures.has(square) ? (
                  <span className="pointer-events-none absolute inset-[7%] rounded-full border-[3px] border-black/30" />
                ) : null}
                {piece && dragFrom !== square ? (
                  <PieceImage color={piece.color} type={piece.type} />
                ) : null}
                {fileIndex === 0 ? (
                  <span
                    className={`pointer-events-none absolute left-0.5 top-0.5 text-[10px] font-semibold leading-none sm:text-xs ${
                      isDark ? "text-[#f0d9b5]" : "text-[#b58863]"
                    }`}
                  >
                    {rank}
                  </span>
                ) : null}
                {rankIndex === 7 ? (
                  <span
                    className={`pointer-events-none absolute bottom-0.5 right-0.5 text-[10px] font-semibold leading-none sm:text-xs ${
                      isDark ? "text-[#f0d9b5]" : "text-[#b58863]"
                    }`}
                  >
                    {file}
                  </span>
                ) : null}
              </button>
            )
          }),
        )}
        <BoardMarks marks={marks} draft={draft} files={files} ranks={ranks} />
      </div>

      {overlay ? (
        <div className="absolute inset-1 flex items-center justify-center rounded-md bg-black/45 px-4 text-center text-sm font-medium text-white">
          {overlay}
        </div>
      ) : null}

      {promotion ? (
        <div className="absolute inset-1 z-20 flex items-center justify-center rounded-md bg-black/45">
          <div
            role="dialog"
            aria-label="Choose a promotion piece"
            className="flex items-center gap-2 rounded-xl bg-surface p-3 shadow-lg"
          >
            {promotion.pieces.map((piece) => (
              <button
                key={piece}
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f0d9b5] transition hover:bg-brand-muted"
                aria-label={`Promote to ${PIECE_NAMES[piece]}`}
                onClick={() => promotion.onChoose(piece)}
              >
                <PieceImage color={promotion.color} type={piece} />
              </button>
            ))}
            <button
              type="button"
              className="ml-1 rounded-lg px-2 py-2 text-sm text-ink-muted transition hover:text-foreground"
              onClick={promotion.onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {ghost ? (
        <div
          className="pointer-events-none fixed z-50 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center drop-shadow-lg"
          style={{ left: ghost.x, top: ghost.y }}
        >
          <PieceImage color={ghost.color} type={ghost.type} />
        </div>
      ) : null}
    </div>
  )
}

function BoardMarks({
  marks,
  draft,
  files,
  ranks,
}: {
  marks: BoardMark[]
  draft: BoardMark | null
  files: string
  ranks: string
}) {
  const shown = draft
    ? [
        ...marks.filter((mark) => mark.from !== draft.from || mark.to !== draft.to),
        draft,
      ]
    : marks
  if (shown.length === 0) return null
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox="0 0 8 8"
      aria-hidden
    >
      {shown.map((mark) =>
        mark.from === mark.to ? (
          <circle
            key={`${mark.from}${mark.to}`}
            cx={squareCenter(mark.from, files, ranks).x}
            cy={squareCenter(mark.from, files, ranks).y}
            r={0.36}
            fill="none"
            stroke={ARROW}
            strokeWidth={0.1}
          />
        ) : (
          <ArrowShape
            key={`${mark.from}${mark.to}`}
            from={mark.from}
            to={mark.to}
            files={files}
            ranks={ranks}
          />
        ),
      )}
    </svg>
  )
}

function ArrowShape({
  from,
  to,
  files,
  ranks,
}: {
  from: Square
  to: Square
  files: string
  ranks: string
}) {
  const start = squareCenter(from, files, ranks)
  const end = squareCenter(to, files, ranks)
  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.hypot(dx, dy)
  if (length === 0) return null
  const ux = dx / length
  const uy = dy / length
  const px = -uy
  const py = ux
  const x1 = start.x + ux * 0.2
  const y1 = start.y + uy * 0.2
  const tipX = end.x - ux * 0.18
  const tipY = end.y - uy * 0.18
  const head = 0.38
  const baseX = tipX - ux * head
  const baseY = tipY - uy * head
  const wing = head * 0.48
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={baseX}
        y2={baseY}
        stroke={ARROW}
        strokeWidth={0.16}
        strokeLinecap="round"
      />
      <polygon
        points={`${tipX},${tipY} ${baseX + px * wing},${baseY + py * wing} ${baseX - px * wing},${baseY - py * wing}`}
        fill={ARROW}
      />
    </g>
  )
}

function squareCenter(square: Square, files: string, ranks: string) {
  return {
    x: files.indexOf(square[0]) + 0.5,
    y: ranks.indexOf(square[1]) + 0.5,
  }
}

const ARROW = "rgba(21, 120, 27, 0.9)"

function PieceImage({ color, type }: { color: Color; type: PieceSymbol }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="pointer-events-none text-[clamp(1.6rem,6vw,2.6rem)] leading-none">
        {UNICODE[color][type]}
      </span>
    )
  }
  return (
    <img
      src={`https://lichess1.org/assets/piece/cburnett/${color}${type.toUpperCase()}.svg`}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      className="pointer-events-none relative z-10 h-[86%] w-[86%] select-none object-contain"
    />
  )
}

function squareLabel(
  square: string,
  piece: { color: Color; type: PieceSymbol } | null,
) {
  if (!piece) return square
  const color = piece.color === "w" ? "white" : "black"
  return `${square}, ${color} ${PIECE_NAMES[piece.type]}`
}
