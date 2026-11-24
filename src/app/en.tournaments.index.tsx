import { createFileRoute } from "@tanstack/react-router"
import { loadTournaments } from "@/server/tournaments"
import { TournamentsPage, tournamentsHead } from "./tournaments.index"

export const Route = createFileRoute("/en/tournaments/")({
  head: () => tournamentsHead("en"),
  loader: () => loadTournaments(),
  component: TournamentsPage,
})
