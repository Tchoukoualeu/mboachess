import { createFileRoute, notFound } from "@tanstack/react-router"
import { loadTournamentById } from "@/server/tournaments"
import { TournamentDetailPage, tournamentHead } from "./tournaments.$id"

export const Route = createFileRoute("/en/tournaments/$id")({
  head: ({ loaderData, params }) => tournamentHead("en", loaderData, params.id),
  loader: async ({ params }) => {
    const tournament = await loadTournamentById({ data: params.id })
    if (!tournament) throw notFound()
    return tournament
  },
  component: TournamentDetailPage,
})
