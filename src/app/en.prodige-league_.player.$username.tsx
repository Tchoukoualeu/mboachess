import { createFileRoute, notFound } from "@tanstack/react-router"
import { loadProdigePlayer } from "@/server/prodigePlayer"
import { playerHead, ProdigePlayerPage } from "./prodige-league_.player.$username"

export const Route = createFileRoute("/en/prodige-league_/player/$username")({
  head: ({ loaderData, params }) =>
    playerHead("en", loaderData, params.username),
  loader: async ({ params }) => {
    const player = await loadProdigePlayer({ data: params.username })
    if (!player) throw notFound()
    return player
  },
  component: ProdigePlayerPage,
})
