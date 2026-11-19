import { createFileRoute, Link } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { ProdigeLeagueSignup } from "@/components/ProdigeLeagueSignup"
import { pageHead, SITE_URL } from "@/lib/seo"
import {
  formatArenaDate,
  PRODIGE_ARENAS,
} from "@/lib/prodigeArenaSchedule"
import { loadProdigeLeague } from "@/server/prodigeLeague"

const TITLE =
  "Prodige League 2026 | Tournoi d'échecs en ligne au Cameroun"
const DESCRIPTION =
  "Saison officielle 2026, 15 novembre–31 décembre : format individuel, rapide 10+0, 100 % en ligne sur Chess.com. Individual online rapid tournament in Cameroon, open entry."
const PATH = "/prodige-league"
const SHARE_IMAGE = "/prodige-league-og.jpg"

const FACTS = [
  { label: "Format", value: "Individuel" },
  { label: "Compétition", value: "100 % en ligne" },
  { label: "Plateforme", value: "Chess.com" },
  { label: "Cadence", value: "Rapide 10+0" },
  { label: "Inscriptions", value: "Illimitées" },
] as const

const STEPS = [
  {
    title: "Qualifications",
    detail: "15 nov. → 26 déc.",
    note: "Inscriptions illimitées",
  },
  {
    title: "Classement général",
    detail: "Accumulation des points",
  },
  {
    title: "Top 16",
    detail: "Meilleurs joueurs du classement",
  },
  {
    title: "Masters des Prodiges",
    detail: "Top 16 → Top 4",
  },
  {
    title: "Échecs d'Or",
    detail: "Grande finale Top 4",
  },
] as const

const PARTNERS = [
  {
    name: "Prodige League",
    detail: "Ensemble vers l'excellence",
  },
  {
    name: "CENT",
    detail: "Conseil Échiquéen National des Tournois",
  },
  {
    name: "Union Académie",
    detail: "Former · Accompagner · Révéler",
  },
  {
    name: "Chess.com",
    detail: "Partenaire officiel",
  },
  {
    name: "Structures nationales des échecs",
    detail: "Partenaires",
  },
] as const

export const Route = createFileRoute("/prodige-league")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      image: SHARE_IMAGE,
      imageAlt: "Prodige League, saison officielle 2026",
      imageWidth: 1024,
      imageHeight: 558,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: "Prodige League — Saison officielle 2026",
        description: DESCRIPTION,
        startDate: "2026-11-15",
        endDate: "2026-12-31",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        sport: "Chess",
        image: `${SITE_URL}${SHARE_IMAGE}`,
        url: `${SITE_URL}${PATH}`,
        location: {
          "@type": "Place",
          name: "Cameroon",
          address: {
            "@type": "PostalAddress",
            addressCountry: "CM",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Prodige League Cameroun",
          url: `${SITE_URL}${PATH}`,
        },
      },
    }),
  loader: () => loadProdigeLeague(),
  component: ProdigeLeaguePage,
})

function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1)
}

function ProdigeLeaguePage() {
  const { players, winners } = Route.useLoaderData()
  const winnersByDay = new Map(winners.map((winner) => [winner.day, winner]))

  return (
    <>
      <section className="hero-prodige relative overflow-hidden text-white">
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e0b45a]">
            Un seul objectif : le titre
          </p>
          <h1 className="font-display mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Prodige League
          </h1>
          <p className="mt-3 max-w-lg text-base leading-7 text-white/90 sm:text-lg">
            La compétition qui révèle les talents
          </p>
          <p className="mt-5 w-fit max-w-full rounded-lg bg-[#e0b45a] px-3 py-1.5 text-xs font-semibold uppercase leading-5 tracking-wide text-[#1a1408] sm:text-sm">
            <span className="block">Saison officielle 2026</span>
            <span className="block">15 novembre – 31 décembre 2026</span>
          </p>
        </div>
      </section>

      <PageShell>
        <section aria-labelledby="arenas-heading" className="mb-10">
          <h2
            id="arenas-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Les arènes
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            Six journées de qualification sur Chess.com. Les deux premières ont
            eu lieu le 15 et le 19 novembre 2026. Les dates des suivantes
            restent à définir.
          </p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRODIGE_ARENAS.map((arena) => {
              const dateLabel = formatArenaDate(arena.date)
              const winner = winnersByDay.get(arena.day)
              const body = (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-wood">
                    Jour {String(arena.day).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {dateLabel}
                  </p>
                  {winner ? (
                    <div className="mt-3 flex items-center gap-2.5">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
                        {winner.avatarUrl ? (
                          <img
                            src={winner.avatarUrl}
                            alt=""
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-ink-muted">
                            {winner.username.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-wood">
                          1er
                        </p>
                        <p className="truncate text-sm font-medium text-foreground">
                          {winner.username}
                        </p>
                        <p className="text-xs tabular-nums text-ink-muted">
                          {formatPoints(winner.points)} pts
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <p
                    className={`mt-2 text-sm ${
                      arena.chesscomId ? "text-brand" : "text-ink-muted"
                    }`}
                  >
                    {arena.chesscomId ? "Classement et parties" : "À venir"}
                  </p>
                </>
              )

              if (!arena.chesscomId) {
                return (
                  <li
                    key={arena.day}
                    className="rounded-xl border border-border bg-surface px-3 py-3"
                  >
                    {body}
                  </li>
                )
              }

              return (
                <li key={arena.day}>
                  <Link
                    to="/prodige-league/arena/$day"
                    params={{ day: String(arena.day) }}
                    className="flex h-full flex-col rounded-xl border border-border bg-surface px-3 py-3 transition hover:border-wood"
                  >
                    {body}
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>

        <section aria-labelledby="path-heading" className="mb-10">
          <h2
            id="path-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Le parcours de la saison
          </h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-5">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-border bg-surface px-3 py-3"
              >
                <p className="text-xs font-semibold text-wood">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
                {"note" in step ? (
                  <p className="mt-0.5 text-xs text-ink-muted">{step.note}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="facts-heading" className="mb-10">
          <h2
            id="facts-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Jouer, apprendre, progresser, devenir prodige
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {FACTS.map((fact) => (
              <li
                key={fact.label}
                className="rounded-xl border border-border bg-surface px-3 py-3"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  {fact.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {fact.value}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="english-summary-heading"
          className="mb-10 rounded-xl border border-border bg-surface p-4 sm:p-5"
        >
          <h2
            id="english-summary-heading"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-wood"
          >
            In English
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground sm:text-base sm:leading-7">
            Prodige League is an individual online rapid tournament (10+0) on
            Chess.com, from 15 November to 31 December 2026 in Cameroon.
            Registration is closed. The arenas, the season path, and the
            format are above.
          </p>
        </section>

        <section aria-labelledby="partners-heading" className="mb-10">
          <h2
            id="partners-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Organisation & partenaires
          </h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {PARTNERS.map((partner) => (
              <li key={partner.name} className="py-3">
                <p className="font-medium text-foreground">{partner.name}</p>
                <p className="text-sm text-ink-muted">{partner.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <ProdigeLeagueSignup players={players} />
      </PageShell>
    </>
  )
}
