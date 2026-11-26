/** Daily snapshots and published months use Cameroon local time. */
export const SNAPSHOT_TIME_ZONE = "Africa/Douala"

/** First month that gets a chart. It becomes visible on 1 January 2027. */
export const FIRST_PUBLISHED_MONTH = "2026-12"

export type EloSnapshotRow = {
  username: string
  /** Calendar day in Africa/Douala, `YYYY-MM-DD`. */
  date: string
  blitz: number | null
  rapid: number | null
}

export type Cadence = "blitz" | "rapid"

export type DailyPoint = {
  date: string
  rating: number
}

export type MonthClimber = {
  username: string
  gain: number
  points: DailyPoint[]
}

/** `YYYY-MM-DD` for an instant in Africa/Douala. */
export function calendarDate(
  now: Date = new Date(),
  timeZone: string = SNAPSHOT_TIME_ZONE,
): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value
  return `${year}-${month}-${day}`
}

/** Move a `YYYY-MM` key by whole months. */
export function shiftMonth(month: string, delta: number): string {
  const [year, monthIndex] = month.split("-").map(Number)
  const date = new Date(Date.UTC(year, monthIndex - 1 + delta, 1))
  const nextYear = date.getUTCFullYear()
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, "0")
  return `${nextYear}-${nextMonth}`
}

export function daysInMonth(month: string): number {
  const [year, monthIndex] = month.split("-").map(Number)
  return new Date(Date.UTC(year, monthIndex, 0)).getUTCDate()
}

/** The next calendar day. `date` is `YYYY-MM-DD`. */
export function nextDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10)
}

/**
 * Finished months from December 2026 onward, newest first.
 * A month appears on the 1st of the following month.
 */
export function publishedMonths(today: string): string[] {
  const months: string[] = []
  let month = FIRST_PUBLISHED_MONTH
  for (let guard = 0; guard < 240; guard++) {
    const visibleFrom = `${shiftMonth(month, 1)}-01`
    if (today < visibleFrom) break
    months.push(month)
    month = shiftMonth(month, 1)
  }
  return months.reverse()
}

/** Split a daily series so a missing day becomes a gap instead of a straight line. */
export function contiguousSegments<T extends { date: string }>(points: readonly T[]): T[][] {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date))
  const groups: T[][] = []
  let current: T[] = []
  for (const point of sorted) {
    const previous = current[current.length - 1]
    if (!previous || nextDate(previous.date) === point.date) {
      current.push(point)
    } else {
      groups.push(current)
      current = [point]
    }
  }
  if (current.length > 0) groups.push(current)
  return groups
}

function ratingOf(row: EloSnapshotRow, cadence: Cadence): number | null {
  const value = row[cadence]
  return typeof value === "number" ? value : null
}

/**
 * Top gains for one cadence in `month` (`YYYY-MM`).
 * Gain is the last rating inside the month minus the last rating before it.
 * A player added during the month starts from their first saved rating.
 */
export function rankMonth(
  snapshots: readonly EloSnapshotRow[],
  month: string,
  cadence: Cadence,
  limit = 3,
): MonthClimber[] {
  const start = `${month}-01`
  const end = `${shiftMonth(month, 1)}-01`
  const byUser = new Map<string, EloSnapshotRow[]>()

  for (const row of snapshots) {
    const key = row.username.trim().toLowerCase()
    if (!key) continue
    const list = byUser.get(key)
    if (list) list.push(row)
    else byUser.set(key, [row])
  }

  const climbers: MonthClimber[] = []
  for (const [key, rows] of byUser) {
    const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date))
    let baseline: number | null = null
    let display = key
    const points: DailyPoint[] = []

    for (const row of sorted) {
      const rating = ratingOf(row, cadence)
      if (row.date < start) {
        if (rating != null) baseline = rating
        continue
      }
      if (row.date >= end || rating == null) continue
      display = row.username.trim() || display
      points.push({ date: row.date, rating })
    }

    if (points.length === 0) continue
    const endRating = points[points.length - 1].rating
    const startRating = baseline ?? points[0].rating
    climbers.push({
      username: display,
      gain: endRating - startRating,
      points,
    })
  }

  climbers.sort((a, b) => {
    if (b.gain !== a.gain) return b.gain - a.gain
    return a.username.localeCompare(b.username, undefined, { sensitivity: "base" })
  })
  return climbers.slice(0, limit)
}
