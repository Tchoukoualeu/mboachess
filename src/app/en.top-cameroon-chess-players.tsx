import { createFileRoute } from "@tanstack/react-router"
import { loadCameroonTopPlayers } from "@/server/cameroonTopPlayers"
import { TopPlayersPage, topPlayersHead } from "./top-cameroon-chess-players"

export const Route = createFileRoute("/en/top-cameroon-chess-players")({
  head: () => topPlayersHead("en"),
  loader: () => loadCameroonTopPlayers(),
  component: TopPlayersPage,
})
