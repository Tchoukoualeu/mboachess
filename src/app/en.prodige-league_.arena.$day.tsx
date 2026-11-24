import { createFileRoute, notFound } from "@tanstack/react-router"
import { loadProdigeArena } from "@/server/prodigeArenas"
import { ProdigeArenaPage, arenaHead } from "./prodige-league_.arena.$day"

export const Route = createFileRoute("/en/prodige-league_/arena/$day")({
  head: ({ loaderData, params }) => arenaHead("en", loaderData, params.day),
  loader: async ({ params }) => {
    const arena = await loadProdigeArena({ data: params.day })
    if (!arena) throw notFound()
    return arena
  },
  component: ProdigeArenaPage,
})
