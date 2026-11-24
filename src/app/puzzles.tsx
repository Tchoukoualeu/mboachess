import { createFileRoute } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { PuzzleTrainer } from "@/components/PuzzleTrainer"
import { getDictionary, useDictionary, type Locale } from "@/lib/i18n"
import { pageHead, webPageJsonLd } from "@/lib/seo"

export function puzzlesHead(locale: Locale) {
  const copy = getDictionary(locale).puzzles
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/puzzles",
    locale,
    jsonLd: webPageJsonLd({
      title: copy.metaTitle,
      description: copy.metaDescription,
      path: "/puzzles",
      locale,
    }),
  })
}

export const Route = createFileRoute("/puzzles")({
  head: () => puzzlesHead("fr"),
  component: PuzzlesPage,
})

export function PuzzlesPage() {
  const copy = useDictionary().puzzles
  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.ledeBefore}{" "}
          <a
            href="https://lichess.org/training"
            target="_blank"
            rel="noreferrer"
            className="text-brand hover:underline"
          >
            Lichess
          </a>
          {copy.ledeAfter}
        </p>
      </header>
      <PuzzleTrainer />
    </PageShell>
  )
}
