import { createFileRoute } from "@tanstack/react-router"
import { loadPastOnlineTournaments } from "@/server/tournaments"
import { PastOnlineTournamentsPage, pastTournamentsHead } from "./tournaments.past-online"

export const Route = createFileRoute("/en/tournaments/past-online")({
  head: () => pastTournamentsHead("en"),
  loader: () => loadPastOnlineTournaments(),
  component: PastOnlineTournamentsPage,
})
