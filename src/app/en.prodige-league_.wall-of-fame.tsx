import { createFileRoute } from "@tanstack/react-router"
import { loadWallOfFame } from "@/server/prodigeWallOfFame"
import { WallOfFamePage, fameHead } from "./prodige-league_.wall-of-fame"

export const Route = createFileRoute("/en/prodige-league_/wall-of-fame")({
  head: () => fameHead("en"),
  loader: () => loadWallOfFame(),
  component: WallOfFamePage,
})
