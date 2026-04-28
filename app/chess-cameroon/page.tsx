import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Chess Cameroon | clubs, events, and players",
  description:
    "Chess Cameroon: a simple hub for chess in Cameroon — clubs, tournaments, communities, and ways to follow Cameroonian players on Chess.com.",
  alternates: {
    canonical: "https://mboachess.com/chess-cameroon",
  },
  openGraph: {
    title: "Chess Cameroon",
    description:
      "A simple hub for chess in Cameroon: clubs, tournaments, communities, and ways to follow Cameroonian players on Chess.com.",
    url: "https://mboachess.com/chess-cameroon",
    siteName: "mboachess",
    type: "article",
  },
}

export default function ChessCameroonPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
          mboachess.com
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Chess Cameroon
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          This page is a lightweight hub for people searching “chess cameroon”.
          It highlights where to play, how to follow players online, and what to
          look for when you’re getting started.
        </p>
        <div className="flex flex-wrap gap-3 pt-1 text-sm">
          <Link
            href="/"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900/70"
          >
            Chess.com player lookup
          </Link>
          <a
            href="https://www.chess.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900/70"
          >
            Play on Chess.com
          </a>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-base font-semibold tracking-tight">Where to play</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            If you’re looking for over-the-board chess in Cameroon, start by
            searching for local chess clubs in your city (Yaoundé, Douala, Bafoussam,
            Garoua, etc.). Many communities coordinate via WhatsApp or Facebook groups.
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Tip: ask for “weekly meetups”, “rapid tournaments”, or “beginner sessions”
            to find events that match your level.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-base font-semibold tracking-tight">Follow players online</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            A lot of “chess cameroon” traffic is about discovering players and tracking
            ratings. On the homepage, you can look up any Chess.com username and see
            blitz/rapid ratings and recent activity.
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            If you’re building a list of Cameroonian players, you can submit usernames
            there so they show up in the table.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="text-base font-semibold tracking-tight">New to chess?</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          If you’re new to chess in Cameroon (or returning after a break), a good
          starting path is:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <li>
            Learn the basics (checkmates, tactics, endgames) and play rapid games.
          </li>
          <li>
            Join a local community and play over-the-board when you can.
          </li>
          <li>
            Track your progress online (ratings, game review, puzzle streaks).
          </li>
        </ol>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Back to the{" "}
          <Link href="/" className="text-emerald-700 underline underline-offset-2 dark:text-emerald-400">
            player lookup
          </Link>
          .
        </p>
      </section>
    </main>
  )
}

