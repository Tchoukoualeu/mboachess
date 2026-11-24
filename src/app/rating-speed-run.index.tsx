import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"
import { CrownIcon } from "@/components/CrownIcon"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import { fill, getDictionary, intlLocale, translateApiError, useDictionary, useLocale, useRouteLoaderData, type Dictionary, type Locale } from "@/lib/i18n"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import {
  getCompetitionStatus,
  getCompetitionWinner,
  type CompetitionStatus,
  type RatingType,
} from "@/lib/ratingSpeedRunShared"
import { loadRatingSpeedRuns } from "@/server/ratingSpeedRun"

function formatDateTime(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

function statusLabel(status: CompetitionStatus, copy: Dictionary["speedRun"]): string {
  switch (status) {
    case "registration-open":
      return copy.status.registrationOpen
    case "upcoming":
      return copy.status.upcoming
    case "running":
      return copy.status.running
    case "finished":
      return copy.status.finished
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
  const dict = useDictionary()
  const copy = dict.speedRun
  const [title, setTitle] = useState(copy.titlePlaceholder)
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
          translateApiError(
            "error" in data ? data.error : undefined,
            dict,
            copy.createFailed,
          ),
        )
        return
      }

      setMessage(copy.created)
      setDescription("")
      setPrize("")
      await router.invalidate()
    } catch {
      setError(copy.createFailed)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mb-6 rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold">
          {copy.createTitle}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">{copy.createLede}</p>
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">{copy.fieldTitle}</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none placeholder:text-ink-muted focus:border-brand"
            placeholder={copy.titlePlaceholder}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">{copy.ratingType}</span>
          <select
            value={ratingType}
            onChange={(event) =>
              setRatingType(event.target.value as RatingType)
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-brand"
          >
            <option value="blitz">{dict.common.blitz}</option>
            <option value="rapid">{dict.common.rapid}</option>
            <option value="bullet">{dict.common.bullet}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-foreground">{copy.description}</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none placeholder:text-ink-muted focus:border-brand"
            placeholder={copy.descriptionPlaceholder}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-foreground">{copy.prize}</span>
          <input
            value={prize}
            onChange={(event) => setPrize(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none placeholder:text-ink-muted focus:border-brand"
            placeholder={copy.prizePlaceholder}
          />
        </label>

        <div className="sm:col-span-2 rounded-lg bg-surface-muted px-4 py-3 text-sm text-ink-muted">
          {copy.scheduleNote}
        </div>

        <div className="sm:col-span-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? copy.creating : copy.create}
          </button>
          {message ? <p className="text-sm text-brand">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        </div>
      </form>
    </section>
  )
}

export function speedRunHead(locale: Locale) {
  const copy = getDictionary(locale).speedRun
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/rating-speed-run",
    locale,
    jsonLd: webPageJsonLd({
      title: copy.metaTitle,
      description: copy.metaDescription,
      path: "/rating-speed-run",
      locale,
    }),
  })
}

export const Route = createFileRoute("/rating-speed-run/")({
  head: () => speedRunHead("fr"),
  validateSearch: (search: Record<string, unknown>): { admin?: boolean } => {
    if (search.admin === "true" || search.admin === true) {
      return { admin: true }
    }
    return {}
  },
  loader: () => loadRatingSpeedRuns(),
  component: RatingSpeedRunIndexPage,
})

export function RatingSpeedRunIndexPage() {
  const dict = useDictionary()
  const copy = dict.speedRun
  const locale = useLocale()
  const competitions = useRouteLoaderData<Awaited<ReturnType<typeof loadRatingSpeedRuns>>>()
  const searchStr = useRouterState({ select: (state) => state.location.searchStr })
  const isAdmin = /(?:^|[?&])admin=true(?:&|$)/.test(searchStr)

  return (
    <PageShell wide>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
            {copy.lede}
          </p>
        </div>
        <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-muted">
          <div className="font-medium text-foreground">{copy.eligibility}</div>
          <div>{copy.eligibilityBody}</div>
        </div>
      </header>

      {isAdmin ? <CreateCompetitionForm /> : null}

      {competitions.length === 0 ? (
        <p className="border border-dashed border-border py-10 text-center text-ink-muted">
          {isAdmin ? copy.emptyAdmin : copy.empty}
        </p>
      ) : (
        <section aria-labelledby="speed-runs-heading" className="space-y-4">
          <h2
            id="speed-runs-heading"
            className="text-sm font-medium text-ink-muted"
          >
            {fill(copy.count, { count: competitions.length })}
          </h2>
          {competitions.map((competition) => {
            const status = getCompetitionStatus(competition)
            const isFinished = status === "finished"
            const winner = getCompetitionWinner(competition)
            const netLabel = winner
              ? `${winner.netPoints > 0 ? "+" : ""}${winner.netPoints}`
              : null

            return (
              <LocaleLink
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
                        {statusLabel(status, copy)}
                      </span>
                    </div>
                    <p className="text-sm text-ink-muted">
                      {fill(copy.ratingOf, { type: dict.common[competition.ratingType] })}
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
                            {copy.winner}
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
                            {copy.net}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-3 grid gap-2 text-sm text-foreground/90 sm:grid-cols-2">
                      <div>
                        <span className="font-medium">{copy.starts}</span>{" "}
                        {formatDateTime(competition.startDate, locale)}
                      </div>
                      <div>
                        <span className="font-medium">{copy.ends}</span>{" "}
                        {formatDateTime(competition.endDate, locale)}
                      </div>
                      <div>
                        <span className="font-medium">{copy.players}</span>{" "}
                        {competition.participants.length}
                      </div>
                      {competition.prize ? (
                        <div>
                          <span className="font-medium">{copy.prizeLabel}</span>{" "}
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
                    {isFinished ? copy.seeResults : copy.open}
                  </div>
                </div>
              </LocaleLink>
            )
          })}
        </section>
      )}
    </PageShell>
  )
}
