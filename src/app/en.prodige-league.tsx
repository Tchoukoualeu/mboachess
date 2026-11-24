import { createFileRoute } from "@tanstack/react-router"
import { loadProdigeLeague, loadProdigeLeaguePlayers } from "@/server/prodigeLeague"
import { ProdigeLeaguePage, prodigeHead } from "./prodige-league"

export const Route = createFileRoute("/en/prodige-league")({
  head: () => prodigeHead("en"),
  loader: async () => {
    const data = await loadProdigeLeague()
    const players = loadProdigeLeaguePlayers().catch(() => null)
    return { ...data, players }
  },
  component: ProdigeLeaguePage,
})
