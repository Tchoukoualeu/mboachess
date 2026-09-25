import { useState } from "react"
import type { PlayerLookupResult } from "@/lib/chesscom"

type Props = {
  rows: PlayerLookupResult[]
}

type Sample = { x: number; y: number }

const VB_W = 640
const VB_H = 280
const PAD_L = 44
const PAD_R = 16
const PAD_T = 16
const PAD_B = 32
const PLOT_W = VB_W - PAD_L - PAD_R
const PLOT_H = VB_H - PAD_T - PAD_B
const BIN_WIDTH = 100

function ratings(
  rows: PlayerLookupResult[],
  key: "blitz" | "rapid",
): number[] {
  return rows
    .filter((row) => !row.error)
    .map((row) => row[key])
    .filter((value): value is number => typeof value === "number" && value > 0)
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function stddev(values: number[]): number {
  if (values.length < 2) return 80
  const mu = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance =
    values.reduce((sum, value) => sum + (value - mu) ** 2, 0) / values.length
  return Math.sqrt(variance) || 80
}

function bandwidth(values: number[]): number {
  const sigma = stddev(values)
  const silverman = 1.06 * sigma * values.length ** -0.2
  return Math.max(silverman, 60)
}

function densityAt(values: number[], x: number, h: number): number {
  const inv = 1 / (values.length * h * Math.sqrt(2 * Math.PI))
  let sum = 0
  for (const value of values) {
    const z = (x - value) / h
    sum += Math.exp(-0.5 * z * z)
  }
  return inv * sum * values.length * BIN_WIDTH
}

function samplesFor(values: number[], xMin: number, xMax: number): Sample[] {
  if (values.length === 0) return []
  const h = bandwidth(values)
  const count = 96
  const step = (xMax - xMin) / (count - 1)
  const points: Sample[] = []
  for (let i = 0; i < count; i++) {
    const x = xMin + i * step
    points.push({ x, y: densityAt(values, x, h) })
  }
  return points
}

function domain(values: number[]): { xMin: number; xMax: number } {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(max - min, 500)
  const mid = (min + max) / 2
  const pad = span * 0.18
  return {
    xMin: Math.floor((mid - span / 2 - pad) / 50) * 50,
    xMax: Math.ceil((mid + span / 2 + pad) / 50) * 50,
  }
}

function niceStep(span: number, target: number): number {
  const rough = span / target
  const pow = 10 ** Math.floor(Math.log10(rough))
  const scaled = rough / pow
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10
  return nice * pow
}

function niceCeil(value: number): number {
  if (value <= 1) return 1
  const pow = 10 ** Math.floor(Math.log10(value))
  const scaled = value / pow
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10
  return nice * pow
}

function xOf(rating: number, xMin: number, xMax: number): number {
  return PAD_L + ((rating - xMin) / (xMax - xMin)) * PLOT_W
}

function yOf(value: number, yMax: number): number {
  return PAD_T + PLOT_H - (value / yMax) * PLOT_H
}

function areaPath(points: Sample[], xMin: number, xMax: number, yMax: number): string {
  if (points.length === 0) return ""
  const baseline = yOf(0, yMax)
  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${xOf(point.x, xMin, xMax).toFixed(1)} ${yOf(point.y, yMax).toFixed(1)}`,
    )
    .join(" ")
  const last = points[points.length - 1]
  return `${line} L ${xOf(last.x, xMin, xMax).toFixed(1)} ${baseline.toFixed(1)} L ${xOf(points[0].x, xMin, xMax).toFixed(1)} ${baseline.toFixed(1)} Z`
}

function strokePath(points: Sample[], xMin: number, xMax: number, yMax: number): string {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${xOf(point.x, xMin, xMax).toFixed(1)} ${yOf(point.y, yMax).toFixed(1)}`,
    )
    .join(" ")
}

function valueAt(points: Sample[], rating: number): number {
  if (points.length === 0) return 0
  if (rating <= points[0].x) return points[0].y
  const last = points[points.length - 1]
  if (rating >= last.x) return last.y
  for (let i = 1; i < points.length; i++) {
    const right = points[i]
    if (rating <= right.x) {
      const left = points[i - 1]
      const t = (rating - left.x) / (right.x - left.x)
      return left.y + t * (right.y - left.y)
    }
  }
  return last.y
}

export function EloDistributionChart({ rows }: Props) {
  const blitzValues = ratings(rows, "blitz")
  const rapidValues = ratings(rows, "rapid")
  const all = [...blitzValues, ...rapidValues]
  const [hover, setHover] = useState<number | null>(null)

  if (all.length === 0) {
    return (
      <section className="mt-6 rounded-xl border border-dashed border-border bg-surface p-6 text-center">
        <h2 className="font-display text-lg font-semibold">Rating distribution</h2>
        <p className="mt-2 text-sm text-ink-muted">No rated players to chart yet.</p>
      </section>
    )
  }

  const { xMin, xMax } = domain(all)
  const blitz = samplesFor(blitzValues, xMin, xMax)
  const rapid = samplesFor(rapidValues, xMin, xMax)
  const peak = Math.max(0, ...blitz.map((point) => point.y), ...rapid.map((point) => point.y))
  const yMax = niceCeil(peak * 1.15)
  const yStep = niceStep(yMax, 4)
  const xStep = niceStep(xMax - xMin, 6)
  const baseline = yOf(0, yMax)
  const avgBlitz = average(blitzValues)
  const avgRapid = average(rapidValues)

  const yTicks: number[] = []
  for (let tick = 0; tick <= yMax + 1e-6; tick += yStep) yTicks.push(tick)
  const xTicks: number[] = []
  const firstTick = Math.ceil(xMin / xStep) * xStep
  for (let tick = firstTick; tick <= xMax; tick += xStep) xTicks.push(tick)

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    const svg = event.currentTarget
    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const matrix = svg.getScreenCTM()
    if (!matrix) return
    const loc = point.matrixTransform(matrix.inverse())
    const rating = xMin + ((loc.x - PAD_L) / PLOT_W) * (xMax - xMin)
    if (rating < xMin || rating > xMax || loc.y < PAD_T || loc.y > PAD_T + PLOT_H) {
      setHover(null)
      return
    }
    setHover(rating)
  }

  const hoverX = hover == null ? null : xOf(hover, xMin, xMax)

  return (
    <section
      className="mt-6 rounded-xl border border-border bg-surface shadow-sm"
      aria-label="Rating distribution"
    >
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Rating distribution</h2>
            <p className="mt-1 text-sm text-ink-muted">
              How blitz and rapid ratings cluster across tracked players.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              Blitz
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
              <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden />
              Rapid
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-emerald-50 px-3 py-3 dark:bg-emerald-900/20">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Avg blitz
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-emerald-900 dark:text-emerald-100">
              {avgBlitz ?? "—"}
            </div>
            <div className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-300/80">
              {blitzValues.length} rated
            </div>
          </div>
          <div className="rounded-lg bg-sky-50 px-3 py-3 dark:bg-sky-900/20">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              Avg rapid
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-sky-900 dark:text-sky-100">
              {avgRapid ?? "—"}
            </div>
            <div className="mt-0.5 text-xs text-sky-700/80 dark:text-sky-300/80">
              {rapidValues.length} rated
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-2 py-4 sm:px-4">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Bell curve of ratings. Average blitz ${avgBlitz ?? "unavailable"}, average rapid ${avgRapid ?? "unavailable"}.`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {yTicks.map((tick) => {
            const y = yOf(tick, yMax)
            return (
              <g key={tick}>
                <line
                  x1={PAD_L}
                  x2={VB_W - PAD_R}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={PAD_L - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-ink-muted text-[11px]"
                >
                  {Number.isInteger(tick) ? tick : tick.toFixed(1)}
                </text>
              </g>
            )
          })}
          <line
            x1={PAD_L}
            x2={VB_W - PAD_R}
            y1={baseline}
            y2={baseline}
            className="stroke-ink-muted/40"
            strokeWidth={1}
          />
          {rapid.length > 0 ? (
            <>
              <path d={areaPath(rapid, xMin, xMax, yMax)} className="fill-sky-500/25" />
              <path
                d={strokePath(rapid, xMin, xMax, yMax)}
                fill="none"
                className="stroke-sky-500"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          ) : null}
          {blitz.length > 0 ? (
            <>
              <path d={areaPath(blitz, xMin, xMax, yMax)} className="fill-emerald-500/25" />
              <path
                d={strokePath(blitz, xMin, xMax, yMax)}
                fill="none"
                className="stroke-emerald-600 dark:stroke-emerald-400"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          ) : null}
          {avgBlitz != null ? (
            <line
              x1={xOf(avgBlitz, xMin, xMax)}
              x2={xOf(avgBlitz, xMin, xMax)}
              y1={PAD_T}
              y2={baseline}
              className="stroke-emerald-700/50 dark:stroke-emerald-300/50"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ) : null}
          {avgRapid != null ? (
            <line
              x1={xOf(avgRapid, xMin, xMax)}
              x2={xOf(avgRapid, xMin, xMax)}
              y1={PAD_T}
              y2={baseline}
              className="stroke-sky-700/50 dark:stroke-sky-300/50"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ) : null}
          {hoverX != null && hover != null ? (
            <line
              x1={hoverX}
              x2={hoverX}
              y1={PAD_T}
              y2={baseline}
              className="stroke-foreground/70"
              strokeWidth={1}
            />
          ) : null}
          {xTicks.map((tick) => (
            <text
              key={tick}
              x={xOf(tick, xMin, xMax)}
              y={VB_H - 8}
              textAnchor="middle"
              className="fill-ink-muted text-[11px]"
            >
              {tick}
            </text>
          ))}
        </svg>
        {hover != null && hoverX != null ? (
          <div
            className="pointer-events-none absolute top-6 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs shadow-sm"
            style={{
              left: `clamp(8px, ${(hoverX / VB_W) * 100}%, calc(100% - 8.5rem))`,
              transform: "translateX(-40%)",
            }}
          >
            <div className="font-semibold tabular-nums">{Math.round(hover)}</div>
            {blitzValues.length > 0 ? (
              <div className="text-emerald-700 dark:text-emerald-400">
                Blitz {valueAt(blitz, hover).toFixed(1)}
              </div>
            ) : null}
            {rapidValues.length > 0 ? (
              <div className="text-sky-700 dark:text-sky-400">
                Rapid {valueAt(rapid, hover).toFixed(1)}
              </div>
            ) : null}
          </div>
        ) : null}
        <p className="px-2 text-center text-[11px] text-ink-muted sm:px-4">
          Players per 100 rating points. Dashed lines mark the averages.
        </p>
      </div>
    </section>
  )
}
