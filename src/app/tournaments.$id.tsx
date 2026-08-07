import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { loadTournamentById } from "@/server/tournaments"
import { pageHead } from "@/lib/seo"
import type { TournamentWithWinners } from "@/lib/tournaments"
import {
  formatDate,
  getUserTimezone,
  formatDateInGermanTime,
} from "@/lib/utils"
import { useEffect, useState } from "react"

function getDaysUntil(date: Date): number {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getTimeRemaining(startDate: Date) {
  const now = new Date()
  const diff = new Date(startDate).getTime() - now.getTime()

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 }
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, totalMs: diff }
}

function CountdownTimer({ startDate }: { startDate: Date }) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getTimeRemaining(startDate),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(startDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate])

  const { hours, minutes, seconds } = timeRemaining

  return (
    <div className="flex shrink-0 flex-col items-start gap-2 rounded-lg bg-wood/15 px-4 py-3 sm:items-end">
      <div className="text-xs font-semibold uppercase tracking-wide text-wood">
        Starts in
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-wood">
            {hours.toString().padStart(2, "0")}
          </div>
          <div className="text-xs font-medium text-wood/80">hrs</div>
        </div>
        <div className="text-2xl font-bold text-wood">:</div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-wood">
            {minutes.toString().padStart(2, "0")}
          </div>
          <div className="text-xs font-medium text-wood/80">min</div>
        </div>
        <div className="text-2xl font-bold text-wood">:</div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-wood">
            {seconds.toString().padStart(2, "0")}
          </div>
          <div className="text-xs font-medium text-wood/80">sec</div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/tournaments/$id")({
  head: ({ loaderData, params }) => {
    const tournament = loaderData as TournamentWithWinners | undefined
    const name = tournament?.name
    const title = name
      ? `${name} | Chess tournament | mboachess`
      : "Tournament Details | mboachess"
    const description = name
      ? `Details for ${name} on mboachess — dates, location, and how to join.`
      : "View tournament information and details"
    return pageHead({
      title,
      description,
      path: `/tournaments/${params.id}`,
    })
  },
  loader: async ({ params }): Promise<TournamentWithWinners> => {
    const tournament = await loadTournamentById({ data: params.id })
    if (!tournament) throw notFound()

    return tournament
  },
  component: TournamentDetailPage,
})

function TournamentDetailPage() {
  const tournament = Route.useLoaderData() as TournamentWithWinners
  const daysUntil = getDaysUntil(tournament.startDate)
  const [userTimezone, setUserTimezone] = useState<string>("UTC")

  useEffect(() => {
    setUserTimezone(getUserTimezone())
  }, [])

  const now = new Date()
  const timeRemainingMs =
    new Date(tournament.startDate).getTime() - now.getTime()
  const fiveHoursInMs = 5 * 60 * 60 * 1000
  const showCountdown = timeRemainingMs > 0 && timeRemainingMs <= fiveHoursInMs

  return (
    <PageShell>
      <p className="mb-4">
        <Link
          to="/tournaments"
          className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
        >
          ← Tournaments
        </Link>
      </p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {tournament.name}
            </h1>
            {tournament.isOnline && (
              <span className="inline-flex items-center rounded-md bg-brand-muted px-3 py-1 text-sm font-medium text-brand">
                Online
              </span>
            )}
          </div>
        </div>
        {showCountdown ? (
          <CountdownTimer startDate={tournament.startDate} />
        ) : (
          <div className="flex shrink-0 flex-col items-start gap-1 rounded-lg bg-brand-muted px-4 py-3 sm:items-end">
            <div className="text-3xl font-bold text-brand">{daysUntil}</div>
            <div className="text-sm font-medium uppercase text-brand">
              {daysUntil === 1 ? "day left" : "days left"}
            </div>
          </div>
        )}
      </div>

      {tournament.description && (
        <section className="mb-6" aria-labelledby="desc-heading">
          <h2
            id="desc-heading"
            className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted"
          >
            Description
          </h2>
          <p className="whitespace-pre-line wrap-break-word text-sm leading-relaxed text-ink-muted">
            {tournament.description}
          </p>
        </section>
      )}

      {tournament.winners.length > 0 && (
        <section
          className="mb-6 rounded-lg border border-wood/30 bg-wood/10 p-4"
          aria-labelledby="winners-heading"
        >
          <h2
            id="winners-heading"
            className="mb-2 text-sm font-semibold uppercase tracking-wide text-wood"
          >
            {tournament.winners.length === 1 ? "Winner" : "Winners"}
          </h2>
          <p className="text-sm text-foreground">
            {tournament.winners.map((username, index) => (
              <span key={username}>
                {index > 0 ? ", " : null}
                <a
                  href={`https://www.chess.com/member/${encodeURIComponent(username)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                >
                  {username}
                </a>
              </span>
            ))}
            {tournament.winnersSource === "chesscom" ? (
              <span className="ml-2 text-xs text-ink-muted">via Chess.com</span>
            ) : null}
          </p>
        </section>
      )}

      <section aria-labelledby="details-heading">
        <h2
          id="details-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Tournament details
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Start date
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              {formatDate(tournament.startDate, userTimezone)}
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              German time: {formatDateInGermanTime(tournament.startDate)}
            </div>
          </div>

          {tournament.endDate && (
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                End date
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {formatDate(tournament.endDate, userTimezone)}
              </div>
              <div className="mt-1 text-xs text-ink-muted">
                German time: {formatDateInGermanTime(tournament.endDate)}
              </div>
            </div>
          )}

          {tournament.location && (
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Location
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {tournament.location}
              </div>
            </div>
          )}

          {tournament.phone && (
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Contact
              </div>
              <div className="mt-1">
                <a
                  href={`tel:${tournament.phone.split("/")[0].trim()}`}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  {tournament.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {tournament.link && (
          <div className="mt-6">
            <a
              href={tournament.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-soft sm:w-auto"
            >
              View tournament details
            </a>
          </div>
        )}
      </section>
    </PageShell>
  )
}
