import type { MonthClimber } from "@/lib/eloGains"
import { contiguousSegments, daysInMonth } from "@/lib/eloGains"

type Props = {
  month: string
  title: string
  empty: string
  aria: string
  series: MonthClimber[]
  gainText: (gain: number) => string
}

const VB_W = 640
const VB_H = 280
const PAD_L = 48
const PAD_R = 16
const PAD_T = 16
const PAD_B = 32
const PLOT_W = VB_W - PAD_L - PAD_R
const PLOT_H = VB_H - PAD_T - PAD_B

const SERIES_STYLE = [
  { stroke: "stroke-brand", fill: "fill-brand", swatch: "bg-brand" },
  { stroke: "stroke-wood", fill: "fill-wood", swatch: "bg-wood" },
  { stroke: "stroke-foreground", fill: "fill-foreground", swatch: "bg-foreground" },
] as const

function formatSigned(gain: number): string {
  if (gain > 0) return `+${gain}`
  return String(gain)
}

function niceStep(span: number, target: number): number {
  const rough = Math.max(span / target, 1)
  const pow = 10 ** Math.floor(Math.log10(rough))
  const scaled = rough / pow
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10
  return nice * pow
}

function xOf(day: number, days: number): number {
  if (days <= 1) return PAD_L + PLOT_W / 2
  return PAD_L + ((day - 1) / (days - 1)) * PLOT_W
}

function yOf(rating: number, yMin: number, yMax: number): number {
  const span = yMax - yMin || 1
  return PAD_T + PLOT_H - ((rating - yMin) / span) * PLOT_H
}

function dayNumber(date: string): number {
  return Number(date.slice(8, 10))
}

export function EloGainChart({
  month,
  title,
  empty,
  aria,
  series,
  gainText,
}: Props) {
  const days = daysInMonth(month)
  const ratings = series.flatMap((climber) =>
    climber.points.map((point) => point.rating),
  )

  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {series.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {series.map((climber, index) => {
              const style = SERIES_STYLE[index % SERIES_STYLE.length]
              return (
                <li key={climber.username}>
                  <a
                    href={`https://www.chess.com/member/${encodeURIComponent(climber.username)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-surface-muted px-2.5 py-1.5 text-sm hover:text-brand"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${style.swatch}`}
                      aria-hidden
                    />
                    <span className="font-medium">{climber.username}</span>
                    <span className="tabular-nums text-ink-muted">
                      {gainText(climber.gain)}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">{empty}</p>
        )}
      </div>

      {ratings.length > 0 ? (
        <ChartPlot
          aria={aria}
          days={days}
          series={series}
          ratings={ratings}
        />
      ) : null}
    </section>
  )
}

function ChartPlot({
  aria,
  days,
  series,
  ratings,
}: {
  aria: string
  days: number
  series: MonthClimber[]
  ratings: number[]
}) {
  const min = Math.min(...ratings)
  const max = Math.max(...ratings)
  const span = Math.max(max - min, 40)
  const pad = span * 0.18
  const yMin = Math.floor((min - pad) / 10) * 10
  const yMax = Math.ceil((max + pad) / 10) * 10
  const yStep = niceStep(yMax - yMin, 4)
  const yTicks: number[] = []
  const firstTick = Math.ceil(yMin / yStep) * yStep
  for (let tick = firstTick; tick <= yMax; tick += yStep) yTicks.push(tick)

  const xTicks = [1]
  for (let day = 8; day < days; day += 7) xTicks.push(day)
  if (xTicks[xTicks.length - 1] !== days) xTicks.push(days)

  return (
    <div className="px-2 py-4 sm:px-4">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={aria}
      >
        {yTicks.map((tick) => {
          const y = yOf(tick, yMin, yMax)
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
                {tick}
              </text>
            </g>
          )
        })}
        {xTicks.map((day) => (
          <text
            key={day}
            x={xOf(day, days)}
            y={VB_H - 10}
            textAnchor="middle"
            className="fill-ink-muted text-[11px]"
          >
            {day}
          </text>
        ))}
        {series.map((climber, index) => {
          const style = SERIES_STYLE[index % SERIES_STYLE.length]
          const segments = contiguousSegments(climber.points)
          return (
            <g key={climber.username}>
              {segments.map((segment) => {
                if (segment.length < 2) return null
                const d = segment
                  .map((point, pointIndex) => {
                    const x = xOf(dayNumber(point.date), days)
                    const y = yOf(point.rating, yMin, yMax)
                    return `${pointIndex === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
                  })
                  .join(" ")
                return (
                  <path
                    key={segment[0].date}
                    d={d}
                    fill="none"
                    className={style.stroke}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )
              })}
              {climber.points.map((point) => (
                <circle
                  key={point.date}
                  cx={xOf(dayNumber(point.date), days)}
                  cy={yOf(point.rating, yMin, yMax)}
                  r={3.5}
                  className={style.fill}
                >
                  <title>
                    {`${climber.username} · ${point.date} · ${point.rating}`}
                  </title>
                </circle>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function formatEloGain(gain: number): string {
  return formatSigned(gain)
}
