import { createFileRoute, Link } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { ProdigeLeagueSignup } from "@/components/ProdigeLeagueSignup"
import { pageHead, SITE_URL } from "@/lib/seo"
import {
  formatArenaDate,
  PRODIGE_ARENAS,
} from "@/lib/prodigeArenaSchedule"
import {
  loadProdigeLeague,
  type ProdigeArenaCardLeader,
} from "@/server/prodigeLeague"

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

function StandingRow({
  player,
  label,
}: {
  player: ProdigeArenaCardLeader
  label: string
}) {
  return (
    <li className="border-b border-border last:border-b-0">
      <a
        href={player.profileUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 px-3 py-3 transition hover:bg-brand-muted/40 sm:gap-4 sm:px-4"
      >
        <span
          className={
            /^\d+$/.test(label)
              ? "w-8 shrink-0 text-center font-mono text-sm tabular-nums text-ink-muted sm:w-10"
              : "w-12 shrink-0 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-ink-muted"
          }
        >
          {label}
        </span>
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
          {player.avatarUrl ? (
            <img
              src={player.avatarUrl}
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-ink-muted">
              {player.username.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground group-hover:text-brand group-hover:underline">
            {player.username}
          </p>
          <p className="mt-0.5 truncate text-xs text-ink-muted">
            {player.days
              .map((day) => `J${day.day} ${formatPoints(day.points)}`)
              .join(" · ")}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
            {formatPoints(player.points)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-ink-muted">
            Pts
          </p>
        </div>
      </a>
    </li>
  )
}

function ProdigeLeaguePage() {
  const { players, winners, leaders, banned } = Route.useLoaderData()
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
            Six journées de qualification sur Chess.com. Les trois premières ont
            eu lieu le 15, le 19 et le 22 novembre 2026. Les dates des suivantes
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

        <section aria-labelledby="standings-heading" className="mb-10">
          <h2
            id="standings-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Classement général
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            Top 16 des points accumulés sur les arènes terminées.
          </p>
          {leaders.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
              Le classement apparaîtra après la première arène.
            </p>
          ) : (
            <ol className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
              {leaders.map((leader) => (
                <StandingRow
                  key={leader.username}
                  player={leader}
                  label={String(leader.rank)}
                />
              ))}
            </ol>
          )}
          {banned.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">
                Joueurs bannis
              </h3>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                Exclus du top 16. Leurs points ne comptent pas pour la
                qualification.
              </p>
              <ul className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
                {banned.map((player) => (
                  <StandingRow
                    key={player.username}
                    player={player}
                    label="Banni"
                  />
                ))}
              </ul>
            </div>
          ) : null}
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
            Registration is closed. The arenas and the overall top 16 are
            above, followed by the season path and the format.
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
