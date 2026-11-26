import { createServerFn } from "@tanstack/react-start"
import {
  calendarDate,
  publishedMonths,
  rankMonth,
  type MonthClimber,
} from "@/lib/eloGains"
import { loadMonthSnapshots } from "@/server/eloSnapshots"

export type EloGainsPageData = {
  today: string
  months: string[]
  month: string | null
  rapid: MonthClimber[]
  blitz: MonthClimber[]
}

export const loadEloGains = createServerFn({ method: "GET" })
  .validator((month: string) => (typeof month === "string" ? month : ""))
  .handler(async ({ data }): Promise<EloGainsPageData> => {
    const today = calendarDate()
    const months = publishedMonths(today)
    const month = months.includes(data) ? data : (months[0] ?? null)
    if (!month) {
      return { today, months, month: null, rapid: [], blitz: [] }
    }
    const snapshots = await loadMonthSnapshots(month)
    return {
      today,
      months,
      month,
      rapid: rankMonth(snapshots, month, "rapid"),
      blitz: rankMonth(snapshots, month, "blitz"),
    }
  })
