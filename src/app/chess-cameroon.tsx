import { createFileRoute, Link } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { pageHead } from "@/lib/seo"

const TITLE = "Chess Cameroon | clubs, events, and players"
const DESCRIPTION =
  "Chess Cameroon: a simple hub for chess in Cameroon — clubs, tournaments, communities, and ways to follow Cameroonian players on Chess.com."

export const Route = createFileRoute("/chess-cameroon")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/chess-cameroon",
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: TITLE,
        description: DESCRIPTION,
        url: "https://mboachess.com/chess-cameroon",
        publisher: {
          "@type": "Organization",
          name: "mboachess",
          url: "https://mboachess.com",
        },
      },
    }),
  component: ChessCameroonPage,
})

function ChessCameroonPage() {
  return (
    <PageShell>
      <header className="space-y-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Chess Cameroon
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-ink-muted">
          A lightweight hub for people searching “chess cameroon”—where to play,
          how to follow players online, and how to get started.
        </p>
        <div className="flex flex-wrap gap-3 pt-1 text-sm">
          <Link
            to="/"
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground transition hover:border-brand/40"
          >
            Chess.com player lookup
          </Link>
          <a
            href="https://www.chess.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground transition hover:border-brand/40"
          >
            Play on Chess.com
          </a>
        </div>
      </header>

      <section className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Where to play
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Looking for over-the-board chess in Cameroon? Start with local clubs
            in your city (Yaoundé, Douala, Bafoussam, Garoua, and more). Many
            communities coordinate via WhatsApp or Facebook.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Tip: ask for weekly meetups, rapid tournaments, or beginner sessions
            to match your level.
          </p>
          <Link
            to="/clubs"
            className="mt-3 inline-block text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            Browse chess clubs →
          </Link>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Follow players online
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Much of “chess cameroon” interest is about discovering players and
            tracking ratings. On the homepage you can look up any Chess.com
            username and see blitz/rapid ratings and recent activity.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Building a list of Cameroonian players? Submit usernames so they
            show up in the table.
          </p>
          <Link
            to="/"
            className="mt-3 inline-block text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            Open player ratings →
          </Link>
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          New to chess?
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          If you’re new to chess in Cameroon (or returning after a break), a
          good starting path is:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-ink-muted">
          <li>
            Learn the basics (checkmates, tactics, endgames) and play rapid
            games.
          </li>
          <li>Join a local community and play over-the-board when you can.</li>
          <li>
            Track your progress online (ratings, game review, puzzle streaks).
          </li>
        </ol>
        <p className="mt-4 text-sm leading-6 text-ink-muted">
          Also see{" "}
          <Link
            to="/tournaments"
            className="text-brand underline underline-offset-2"
          >
            tournaments
          </Link>{" "}
          and{" "}
          <Link
            to="/content-creators"
            className="text-brand underline underline-offset-2"
          >
            content creators
          </Link>
          .
        </p>
      </section>
    </PageShell>
  )
}
