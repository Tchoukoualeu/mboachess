import { createFileRoute, Link } from "@tanstack/react-router"
import { EloDistributionChart } from "@/components/EloDistributionChart"
import { OnlineNowBox } from "@/components/OnlineNowBox"
import { PageShell } from "@/components/PageShell"
import { RatingLeaders } from "@/components/RatingLeaders"
import { RatingsTable } from "@/components/RatingsTable"
import { SubmitUsernameForm } from "@/components/SubmitUsernameForm"
import { ONLINE_WITHIN_SEC } from "@/lib/chesscom"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { loadHomeData } from "@/server/home"

const HOME_TITLE =
  "Mboachess - Chess in Cameroon | Players, Clubs & Tournaments"
const HOME_DESCRIPTION =
  "The hub for chess in Cameroon. Track Cameroonian chess players' ratings, discover local chess clubs, view upcoming tournaments, and connect with the chess community across Cameroon."

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: "/",
      jsonLd: webPageJsonLd({
        title: HOME_TITLE,
        description: HOME_DESCRIPTION,
        path: "/",
      }),
    }),
  loader: () => loadHomeData(),
  component: Home,
})

function Home() {
  const { rows, blitzLeader, rapidLeader } = Route.useLoaderData()

  return (
    <>
      <section className="hero-board relative overflow-hidden text-white">
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col justify-center px-4 py-10 pb-14 sm:px-6 sm:py-12 sm:pb-16">
          <div className="animate-fade-up relative z-10 max-w-xl rounded-xl bg-black/35 px-4 py-4 backdrop-blur-[2px] sm:px-5 sm:py-5">
            <h1 className="font-display text-3xl font-semibold tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl">
              Mboachess
            </h1>
            <p className="animate-fade-up-delay mt-2 max-w-md text-sm leading-6 text-white sm:text-base sm:leading-7">
              Follow Cameroonian players on Chess.com—ratings, activity, and the
              community in one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#ratings"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-muted"
              >
                View ratings
              </a>
              <a
                href="#submit"
                className="inline-flex items-center justify-center rounded-lg border border-white/50 bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/25"
              >
                Add a player
              </a>
            </div>
          </div>
          <img
            src="/queen.png"
            alt=""
            width={180}
            height={180}
            className="animate-fade-in pointer-events-none absolute right-2 top-1/2 h-28 w-28 -translate-y-1/2 object-contain opacity-15 sm:right-6 sm:h-36 sm:w-36"
          />
        </div>
      </section>

      <PageShell className="pt-0 sm:pt-0">
        <div className="relative z-10 -mt-6 mb-8 sm:-mt-8">
          <OnlineNowBox rows={rows} />
        </div>

        <section aria-labelledby="leaders-heading" className="mb-8">
          <h2
            id="leaders-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Leaders
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Top blitz and rapid ratings among tracked players.
          </p>
          <div className="mt-4">
            <RatingLeaders
              blitzLeader={blitzLeader}
              rapidLeader={rapidLeader}
            />
          </div>
        </section>

        <section aria-labelledby="explore-heading" className="mb-10">
          <h2
            id="explore-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Explore
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Tournaments, clubs, creators, and more across Cameroon chess.
          </p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {(
              [
                {
                  to: "/top-cameroon-chess-players" as const,
                  label: "Top 100 players",
                  blurb: "Best Cameroon blitz and rapid on Chess.com",
                },
                {
                  to: "/tournaments" as const,
                  label: "Tournaments",
                  blurb: "Upcoming events to play or follow",
                },
                {
                  to: "/tournaments/past-online" as const,
                  label: "Past online",
                  blurb: "Previous online tournament results",
                },
                {
                  to: "/rating-speed-run" as const,
                  label: "Rating speed run",
                  blurb: "Timed rating-gain competitions",
                  search: {} as Record<string, never>,
                },
                {
                  to: "/clubs" as const,
                  label: "Chess clubs",
                  blurb: "Local clubs and meetups",
                },
                {
                  to: "/content-creators" as const,
                  label: "Content creators",
                  blurb: "Streams, channels, and socials",
                },
                {
                  to: "/chess-cameroon" as const,
                  label: "Chess Cameroon",
                  blurb: "Start here if you searched for chess cameroon",
                },
              ] as const
            ).map((item) => (
              <li key={item.to}>
                {"search" in item && item.search !== undefined ? (
                  <Link
                    to={item.to}
                    search={item.search}
                    className="group flex items-baseline justify-between gap-4 py-3.5 transition hover:bg-brand-muted/40"
                  >
                    <span>
                      <span className="font-medium text-foreground group-hover:text-brand">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">
                        {item.blurb}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-brand opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={item.to}
                    className="group flex items-baseline justify-between gap-4 py-3.5 transition hover:bg-brand-muted/40"
                  >
                    <span>
                      <span className="font-medium text-foreground group-hover:text-brand">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">
                        {item.blurb}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-brand opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="submit" aria-labelledby="submit-heading" className="mb-8">
          <h2
            id="submit-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Add a player
          </h2>
          <p className="mt-1 mb-4 text-sm text-ink-muted">
            Submit a Chess.com username to include them in the ratings table.
          </p>
          <SubmitUsernameForm />
        </section>

        <section id="ratings" aria-labelledby="ratings-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2
                id="ratings-heading"
                className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Player ratings
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Blitz and rapid from the Chess.com public API. Online (green
                dot) uses recent profile and game times within{" "}
                {ONLINE_WITHIN_SEC / 60} minutes.
              </p>
            </div>
            <p className="text-sm font-medium text-ink-muted">
              {rows.length} players
            </p>
          </div>

          <RatingsTable rows={rows} />

          <EloDistributionChart rows={rows} />
        </section>
      </PageShell>
    </>
  )
}
