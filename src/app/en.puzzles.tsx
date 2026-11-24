import { createFileRoute } from "@tanstack/react-router"
import { PuzzlesPage, puzzlesHead } from "./puzzles"

export const Route = createFileRoute("/en/puzzles")({
  head: () => puzzlesHead("en"),
  component: PuzzlesPage,
})
