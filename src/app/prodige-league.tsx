import { createFileRoute } from "@tanstack/react-router"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import { ProdigeLeagueSignup } from "@/components/ProdigeLeagueSignup"
import { fill, getDictionary, localizePath, useDictionary, useLocale, useRouteLoaderData, type Locale } from "@/lib/i18n"
import { pageHead, SITE_URL } from "@/lib/seo"
import {
  formatArenaDate,
  PRODIGE_ARENAS,
} from "@/lib/prodigeArenaSchedule"
import type { ProdigeLeaguePlayer } from "@/lib/prodigeLeague"
import {
  loadProdigeLeague,
  loadProdigeLeaguePlayers,
  type ProdigeArenaCardLeader,
  type ProdigeLeagueData,
} from "@/server/prodigeLeague"

const PATH = "/prodige-league"
const SHARE_IMAGE = "/prodige-league-og.jpg"

export function prodigeHead(locale: Locale) {
  const copy = getDictionary(locale).prodige
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: PATH,
    locale,
    image: SHARE_IMAGE,
    imageAlt: copy.imageAlt,
    imageWidth: 1024,
    imageHeight: 558,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: copy.eventName,
      description: copy.metaDescription,
      inLanguage: locale,
      startDate: "2026-11-15",
      endDate: "2026-12-31",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      sport: "Chess",
      image: `${SITE_URL}${SHARE_IMAGE}`,
      url: `${SITE_URL}${localizePath(PATH, locale)}`,
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
        url: `${SITE_URL}${localizePath(PATH, locale)}`,
      },
    },
  })
}

export const Route = createFileRoute("/prodige-league")({
  head: () => prodigeHead("fr"),
  loader: async () => {
    const data = await loadProdigeLeague()
    // Started after the core data so a cold start doesn't open extra DB
    // connections in parallel. Not awaited: the list streams in later.
    const players = loadProdigeLeaguePlayers().catch(() => null)
    return { ...data, players }
  },
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
  const copy = useDictionary().prodige
  return (
    <li className="border-b border-border last:border-b-0">
      <LocaleLink
        to="/prodige-league/player/$username"
        params={{ username: player.username }}
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
              .map((day) =>
                fill(copy.dayPoints, {
                  day: day.day,
                  points: formatPoints(day.points),
                }),
              )
              .join(" · ")}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
            {formatPoints(player.points)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-ink-muted">
            {copy.points}
          </p>
        </div>
      </LocaleLink>
    </li>
  )
}

export function ProdigeLeaguePage() {
  const dict = useDictionary()
  const copy = dict.prodige
  const locale = useLocale()
  const { players, winners, leaders, banned } = useRouteLoaderData<
    ProdigeLeagueData & { players: Promise<ProdigeLeaguePlayer[] | null> }
  >()
  const winnersByDay = new Map(winners.map((winner) => [winner.day, winner]))

  return (
    <>
      <section className="hero-prodige relative overflow-hidden text-white">
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e0b45a]">
            {copy.kicker}
          </p>
          <h1 className="font-display mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Prodige League
          </h1>
          <p className="mt-3 max-w-lg text-base leading-7 text-white/90 sm:text-lg">
            {copy.tagline}
          </p>
          <p className="mt-5 w-fit max-w-full rounded-lg bg-[#e0b45a] px-3 py-1.5 text-xs font-semibold uppercase leading-5 tracking-wide text-[#1a1408] sm:text-sm">
            <span className="block">{copy.season}</span>
            <span className="block">{copy.dates}</span>
          </p>
        </div>
      </section>

      <PageShell>
        <section aria-labelledby="arenas-heading" className="mb-10">
          <h2
            id="arenas-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {copy.arenasTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {copy.arenasLede}
          </p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRODIGE_ARENAS.map((arena) => {
              const dateLabel =
                formatArenaDate(arena.date, locale) || dict.prodigeArena.datePending
              const winner = winnersByDay.get(arena.day)
              const body = (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-wood">
                    {fill(copy.day, { day: String(arena.day).padStart(2, "0") })}
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
                          {copy.first}
                        </p>
                        <p className="truncate text-sm font-medium text-foreground">
                          {winner.username}
                        </p>
                        <p className="text-xs tabular-nums text-ink-muted">
                          {fill(copy.pointsShort, { points: formatPoints(winner.points) })}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <p
                    className={`mt-2 text-sm ${
                      arena.chesscomId ? "text-brand" : "text-ink-muted"
                    }`}
                  >
                    {arena.chesscomId ? copy.standingsLink : copy.upcoming}
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
                  <LocaleLink
                    to="/prodige-league/arena/$day"
                    params={{ day: String(arena.day) }}
                    className="flex h-full flex-col rounded-xl border border-border bg-surface px-3 py-3 transition hover:border-wood"
                  >
                    {body}
                  </LocaleLink>
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
            {copy.standingsTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {copy.standingsLede}
          </p>
          {leaders.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
              {copy.standingsEmpty}
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
                {copy.bannedTitle}
              </h3>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                {copy.bannedLede}
              </p>
              <ul className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
                {banned.map((player) => (
                  <StandingRow
                    key={player.username}
                    player={player}
                    label={copy.banned}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="fame-heading" className="mb-10">
          <h2
            id="fame-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {dict.prodigeFame.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {dict.prodigeFame.sectionLede}
          </p>
          <p className="mt-3">
            <LocaleLink
              to="/prodige-league/wall-of-fame"
              className="text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {dict.prodigeFame.link}
            </LocaleLink>
          </p>
        </section>

        <section aria-labelledby="rewards-heading" className="mb-10">
          <h2
            id="rewards-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {copy.rewardsTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {copy.rewardsLede}
          </p>
          <p className="mt-3">
            <LocaleLink
              to="/prodige-league/rewards"
              className="text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {copy.rewardsLink}
            </LocaleLink>
          </p>
        </section>

        <section aria-labelledby="path-heading" className="mb-10">
          <h2
            id="path-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {copy.pathTitle}
          </h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-5">
            {copy.steps.map((step, index) => (
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
                {step.note ? (
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
            {copy.factsTitle}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {copy.facts.map((fact) => (
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

        {locale === "fr" ? (
          <section
            aria-labelledby="english-summary-heading"
            className="mb-10 rounded-xl border border-border bg-surface p-4 sm:p-5"
          >
            <h2
              id="english-summary-heading"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-wood"
            >
              {copy.englishTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground sm:text-base sm:leading-7">
              {copy.englishBody}
            </p>
          </section>
        ) : null}

        <section aria-labelledby="partners-heading" className="mb-10">
          <h2
            id="partners-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {copy.partnersTitle}
          </h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {copy.partners.map((partner) => (
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
