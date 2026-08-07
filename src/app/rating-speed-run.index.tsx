import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"
import { CrownIcon } from "@/components/CrownIcon"
import { PageShell } from "@/components/PageShell"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import {
  getCompetitionStatus,
  getCompetitionWinner,
  type CompetitionStatus,
  type RatingType,
} from "@/lib/ratingSpeedRunShared"
import { loadRatingSpeedRuns } from "@/server/ratingSpeedRun"

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

function ratingTypeLabel(ratingType: RatingType): string {
  return ratingType.charAt(0).toUpperCase() + ratingType.slice(1)
}

function statusLabel(status: CompetitionStatus): string {
  switch (status) {
    case "registration-open":
      return "Registration open"
    case "upcoming":
      return "Starting soon"
    case "running":
      return "Running"
    case "finished":
      return "Finished"
  }
}

function statusClasses(status: CompetitionStatus): string {
  switch (status) {
    case "registration-open":
      return "bg-brand-muted text-brand"
    case "upcoming":
      return "bg-wood/15 text-wood"
    case "running":
      return "bg-brand text-white"
    case "finished":
      return "bg-foreground text-background"
  }
}

function CreateCompetitionForm() {
  const router = useRouter()
  const [title, setTitle] = useState("Rating speed run")
  const [description, setDescription] = useState("")
  const [prize, setPrize] = useState("")
  const [ratingType, setRatingType] = useState<RatingType>("blitz")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/rating-speed-run/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, prize, ratingType }),
      })
      const data = (await response.json()) as { ok: true } | { error?: string }

      if (!response.ok) {
        setError(
          "error" in data
            ? (data.error ?? "Could not create competition.")
            : "Could not create competition.",
        )
        return
      }

      setMessage("Competition created. Registration is now open for 24 hours.")
      setDescription("")
      setPrize("")
      await router.invalidate()
    } catch {
      setError("Could not create competition.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mb-6 rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold">
          Create a new speed run
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Registration opens immediately and closes after 24 hours. The
          competition then runs for exactly 2 days.
        </p>
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none placeholder:text-ink-muted focus:border-brand"
            placeholder="Rating speed run"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Rating type</span>
          <select
            value={ratingType}
            onChange={(event) =>
              setRatingType(event.target.value as RatingType)
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-brand"
          >
            <option value="blitz">Blitz</option>
            <option value="rapid">Rapid</option>
            <option value="bullet">Bullet</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-foreground">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none placeholder:text-ink-muted focus:border-brand"
            placeholder="Explain the format, rules, and what players should know about this speed run."
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-foreground">Prize</span>
          <input
            value={prize}
            onChange={(event) => setPrize(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none placeholder:text-ink-muted focus:border-brand"
            placeholder="Example: 25,000 FCFA + trophy"
          />
        </label>

        <div className="sm:col-span-2 rounded-lg bg-surface-muted px-4 py-3 text-sm text-ink-muted">
          Every speed run follows the same schedule: 24 hours to register, then
          2 days of rating competition.
        </div>

        <div className="sm:col-span-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create competition"}
          </button>
          {message ? <p className="text-sm text-brand">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        </div>
      </form>
    </section>
  )
}

const SPEED_RUN_TITLE = "Rating speed run | mboachess"
const SPEED_RUN_DESCRIPTION =
  "Create and track rating speed run competitions using Chess.com accounts."

export const Route = createFileRoute("/rating-speed-run/")({
  head: () =>
    pageHead({
      title: SPEED_RUN_TITLE,
      description: SPEED_RUN_DESCRIPTION,
      path: "/rating-speed-run",
      jsonLd: webPageJsonLd({
        title: SPEED_RUN_TITLE,
        description: SPEED_RUN_DESCRIPTION,
        path: "/rating-speed-run",
      }),
    }),
  validateSearch: (search: Record<string, unknown>): { admin?: boolean } => {
    if (search.admin === "true" || search.admin === true) {
      return { admin: true }
    }
    return {}
  },
  loader: () => loadRatingSpeedRuns(),
  component: RatingSpeedRunIndexPage,
})

function RatingSpeedRunIndexPage() {
  const competitions = Route.useLoaderData()
  const { admin } = Route.useSearch()
  const isAdmin = admin === true

  return (
    <PageShell wide>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Rating speed run
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
            Contestants register with a Chess.com account during a 24-hour
            signup window. Once registration closes, the speed run lasts 2 days
            and the player with the highest net rating gain wins.
          </p>
        </div>
        <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-muted">
          <div className="font-medium text-foreground">Eligibility</div>
          <div>
            Chess.com account must be at least 60 days old at start time, and
            rated at least 400 in the competition category.
          </div>
        </div>
      </header>

      {isAdmin ? <CreateCompetitionForm /> : null}

      {competitions.length === 0 ? (
        <p className="border border-dashed border-border py-10 text-center text-ink-muted">
          {isAdmin
            ? "No competition yet. Create one above to open registration."
            : "No competition yet. Check back soon."}
        </p>
      ) : (
        <section aria-labelledby="speed-runs-heading" className="space-y-4">
          <h2
            id="speed-runs-heading"
            className="text-sm font-medium text-ink-muted"
          >
            Speed run competitions ({competitions.length})
          </h2>
          {competitions.map((competition) => {
            const status = getCompetitionStatus(competition)
            const isFinished = status === "finished"
            const winner = getCompetitionWinner(competition)
            const netLabel = winner
              ? `${winner.netPoints > 0 ? "+" : ""}${winner.netPoints}`
              : null

            return (
              <Link
                key={competition.id}
                to="/rating-speed-run/$id"
                params={{ id: competition.id }}
                className={`block rounded-xl border p-4 transition hover:border-brand/40 sm:p-6 ${
                  isFinished
                    ? "border-wood/40 bg-wood/5"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {competition.title}
                      </h3>
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${statusClasses(status)}`}
                      >
                        {statusLabel(status)}
                      </span>
                    </div>
                    <p className="text-sm text-ink-muted">
                      {ratingTypeLabel(competition.ratingType)} rating
                    </p>
                    {competition.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                        {competition.description}
                      </p>
                    ) : null}

                    {isFinished && winner ? (
                      <div className="mt-4 flex items-center gap-3 rounded-xl border border-wood/40 bg-wood/10 px-3 py-3">
                        <div className="relative h-11 w-11 shrink-0">
                          <div
                            className="pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 translate-y-[-35%]"
                            aria-hidden
                          >
                            <CrownIcon className="h-4 w-4 text-wood" />
                          </div>
                          <div className="h-full w-full overflow-hidden rounded-full border-2 border-wood/50 bg-surface-muted">
                            {winner.avatarUrl ? (
                              <img
                                src={winner.avatarUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-sm font-bold text-ink-muted">
                                {winner.username.slice(0, 1).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-wood">
                            Winner
                          </div>
                          <div className="truncate font-mono text-base font-semibold text-foreground">
                            {winner.username}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-xl font-bold tabular-nums text-brand">
                            {netLabel}
                          </div>
                          <div className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                            net
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-3 grid gap-2 text-sm text-foreground/90 sm:grid-cols-2">
                      <div>
                        <span className="font-medium">Starts:</span>{" "}
                        {formatDateTime(competition.startDate)}
                      </div>
                      <div>
                        <span className="font-medium">Ends:</span>{" "}
                        {formatDateTime(competition.endDate)}
                      </div>
                      <div>
                        <span className="font-medium">Players:</span>{" "}
                        {competition.participants.length}
                      </div>
                      {competition.prize ? (
                        <div>
                          <span className="font-medium">Prize:</span>{" "}
                          {competition.prize}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={`shrink-0 text-sm font-medium ${
                      isFinished ? "text-wood" : "text-brand"
                    }`}
                  >
                    {isFinished ? "See results →" : "Open competition →"}
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      )}
    </PageShell>
  )
}
