import { createFileRoute } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { PuzzleTrainer } from "@/components/PuzzleTrainer"
import { pageHead, webPageJsonLd } from "@/lib/seo"

const TITLE = "Chess Puzzles | mboachess"
const DESCRIPTION =
  "Solve chess tactics from the Lichess puzzle database. Pick a theme and difficulty, find the best move, and build a streak."

export const Route = createFileRoute("/puzzles")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/puzzles",
      jsonLd: webPageJsonLd({
        title: TITLE,
        description: DESCRIPTION,
        path: "/puzzles",
      }),
    }),
  component: PuzzlesPage,
})

function PuzzlesPage() {
  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Chess puzzles
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          The opponent moves first. Find the best reply, then keep going until
          the tactic is finished. Puzzles come from{" "}
          <a
            href="https://lichess.org/training"
            target="_blank"
            rel="noreferrer"
            className="text-brand hover:underline"
          >
            Lichess
          </a>
          .
        </p>
      </header>
      <PuzzleTrainer />
    </PageShell>
  )
}
