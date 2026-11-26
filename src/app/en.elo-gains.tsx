import { createFileRoute } from "@tanstack/react-router"
import { loadEloGains } from "@/server/eloGains"
import { EloGainsPage, eloGainsHead } from "./elo-gains"

function readMonth(search: Record<string, unknown>): { month?: string } {
  if (typeof search.month === "string" && /^\d{4}-\d{2}$/.test(search.month)) {
    return { month: search.month }
  }
  return {}
}

export const Route = createFileRoute("/en/elo-gains")({
  head: () => eloGainsHead("en"),
  validateSearch: readMonth,
  loaderDeps: ({ search }) => ({ month: search.month }),
  loader: ({ deps }) => loadEloGains({ data: deps.month ?? "" }),
  component: EloGainsPage,
})
