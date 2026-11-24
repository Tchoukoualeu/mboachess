import { createFileRoute } from "@tanstack/react-router"
import { ChessCameroonPage, chessCameroonHead } from "./chess-cameroon"

export const Route = createFileRoute("/en/chess-cameroon")({
  head: () => chessCameroonHead("en"),
  component: ChessCameroonPage,
})
