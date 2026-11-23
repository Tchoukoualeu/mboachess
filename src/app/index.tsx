import { createFileRoute } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { EloDistributionChart } from "@/components/EloDistributionChart"
import { ExploreGrid } from "@/components/ExploreGrid"
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

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description: ReactNode
}) {
  return (
    <div className="mb-4">
      <h2
        id={id}
        className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
      >
        {title}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>
    </div>
  )
}

function Home() {
  const { rows, blitzLeader, rapidLeader } = Route.useLoaderData()
  const onlineCount = rows.filter((row) => row.online).length

  const stats = [
    { label: "Players tracked", value: rows.length },
    { label: "Online now", value: onlineCount },
    { label: "Top blitz", value: blitzLeader?.blitz ?? "—" },
    { label: "Top rapid", value: rapidLeader?.rapid ?? "—" },
  ]

  return (
    <>
      <section className="hero-board relative overflow-hidden text-white">
        <div className="relative mx-auto w-full max-w-4xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14 sm:pb-24">
          <div
            aria-hidden
            className="animate-fade-in pointer-events-none absolute top-1/2 -right-10 -translate-y-1/2 sm:right-2"
          >
            <img
              src="/queen.png"
              alt=""
              width={224}
              height={224}
              className="h-44 w-44 object-contain opacity-10 invert sm:h-56 sm:w-56"
            />
          </div>

          <div className="relative max-w-2xl">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Mboachess
            </p>
            <h1 className="animate-fade-up mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Chess in Cameroon, <span className="text-gold">live.</span>
            </h1>
            <p className="animate-fade-up-delay mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Ratings, live activity and leaders for Cameroonian players on
              Chess.com, plus tournaments, clubs and puzzles.
            </p>
            <div className="animate-fade-up-delay mt-6 flex flex-wrap gap-3">
              <a
                href="#ratings"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:bg-brand-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View ratings
              </a>
              <a
                href="#submit"
                className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Add a player
              </a>
            </div>
          </div>

          <dl className="animate-fade-up-delay relative mt-8 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/15 ring-1 ring-white/15 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse bg-black/25 px-4 py-3"
              >
                <dt className="text-xs text-white/65">{stat.label}</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PageShell className="pt-0 sm:pt-0">
        <div className="relative -mt-10 mb-12 sm:-mt-12">
          <OnlineNowBox rows={rows} />
        </div>

        <section
          id="ratings"
          aria-labelledby="ratings-heading"
          className="mb-12 scroll-mt-20"
        >
          <SectionHeading
            id="ratings-heading"
            title="Player ratings"
            description={
              <>
                Blitz and rapid from the Chess.com public API. The green dot
                marks activity within the last {ONLINE_WITHIN_SEC / 60} minutes.
              </>
            }
          />
          <RatingsTable rows={rows} />
          <EloDistributionChart rows={rows} />
        </section>

        <section aria-labelledby="leaders-heading" className="mb-12">
          <SectionHeading
            id="leaders-heading"
            title="Leaders"
            description="Top three blitz and rapid ratings among tracked players."
          />
          <RatingLeaders rows={rows} />
        </section>

        <section aria-labelledby="explore-heading" className="mb-12">
          <SectionHeading
            id="explore-heading"
            title="Explore"
            description="Tournaments, clubs, creators, and more across Cameroon chess."
          />
          <ExploreGrid />
        </section>

        <section
          id="submit"
          aria-labelledby="submit-heading"
          className="mb-4 scroll-mt-20 rounded-xl border border-brand/20 bg-brand-muted/40 p-5 sm:p-6"
        >
          <SectionHeading
            id="submit-heading"
            title="Add a player"
            description="Not in the list? Submit a Chess.com username and it will appear in the ratings table."
          />
          <SubmitUsernameForm />
        </section>
      </PageShell>
    </>
  )
}
