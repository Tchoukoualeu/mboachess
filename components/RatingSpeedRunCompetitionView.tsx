import { useRouter } from "@tanstack/react-router"
import { useMemo, useState, type FormEvent } from "react"
import { CrownIcon } from "@/components/CrownIcon"
import { LocaleLink } from "@/components/LocaleLink"
import { fill, intlLocale, translateApiError, useDictionary, useLocale, type Dictionary } from "@/lib/i18n"
import {
  getCompetitionStatus,
  getCompetitionWinner,
  type CompetitionStatus,
  type RatingSpeedRunCompetition,
  type RatingSpeedRunParticipant,
  type RatingType,
} from "@/lib/ratingSpeedRunShared"

function formatDateTime(date: Date, locale: ReturnType<typeof useLocale>): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

function formatDuration(target: Date): string {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return "0h 0m"
  const totalMinutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

function formatRatingValue(value: number | null): string {
  return value == null ? "—" : String(value)
}

function statColor(delta: number): string {
  if (delta > 0) return "text-emerald-700 dark:text-emerald-400"
  if (delta < 0) return "text-rose-700 dark:text-rose-400"
  return "text-zinc-900 dark:text-zinc-100"
}

function statusLabel(
  status: CompetitionStatus,
  copy: Dictionary["speedRun"],
): string {
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
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    case "upcoming":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    case "running":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    case "finished":
      return "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  }
}

function ratingTypeLabel(
  ratingType: RatingType,
  dict: Dictionary,
): string {
  return dict.common[ratingType]
}

function getWinner(competition: RatingSpeedRunCompetition | null) {
  return getCompetitionWinner(competition)
}

function WinnerBanner({
  winner,
  prize,
  ratingType,
}: {
  winner: RatingSpeedRunParticipant
  prize?: string
  ratingType: RatingType
}) {
  const copy = useDictionary().speedRun
  const dict = useDictionary()
  const initial = winner.username.slice(0, 1).toUpperCase()
  const netLabel = `${winner.netPoints > 0 ? "+" : ""}${winner.netPoints}`

  return (
    <section
      aria-label={fill(copy.winnerAria, { name: winner.username })}
      className="overflow-hidden rounded-2xl border-2 border-amber-300 bg-linear-to-br from-amber-50 via-white to-amber-100/80 shadow-md dark:border-amber-600/50 dark:from-amber-950/40 dark:via-zinc-900 dark:to-amber-950/20"
    >
      <div className="flex flex-col items-center gap-5 px-5 py-8 text-center sm:px-8 sm:py-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-200/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
          <CrownIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          {copy.winner}
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          >
            <CrownIcon className="h-8 w-8 text-amber-500 drop-shadow dark:text-amber-400 sm:h-10 sm:w-10" />
          </div>
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-amber-300 bg-zinc-100 shadow-sm dark:border-amber-500/60 dark:bg-zinc-800 sm:h-28 sm:w-28">
            {winner.avatarUrl ? (
              <img
                src={winner.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-zinc-500 sm:text-4xl">
                {initial}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-2">
          <a
            href={`https://www.chess.com/member/${encodeURIComponent(winner.username)}`}
            target="_blank"
            rel="noreferrer"
            className="block truncate font-mono text-3xl font-bold tracking-tight text-zinc-900 underline decoration-amber-400/50 underline-offset-4 hover:decoration-amber-500 dark:text-zinc-50 dark:decoration-amber-500/40 sm:text-4xl"
          >
            {winner.username}
          </a>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            {fill(copy.topGain, { type: ratingTypeLabel(ratingType, dict) })}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div
            className={`text-5xl font-bold tabular-nums tracking-tight sm:text-6xl ${statColor(winner.netPoints)}`}
          >
            {netLabel}
          </div>
          <div className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {copy.netPoints}
          </div>
        </div>

        {prize ? (
          <div className="mt-1 rounded-xl bg-amber-100/90 px-5 py-3 text-sm font-semibold text-amber-950 dark:bg-amber-500/15 dark:text-amber-100 sm:text-base">
            {fill(copy.prizeBanner, { prize })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function JoinCompetitionForm({ competitionId }: { competitionId: string }) {
  const router = useRouter()
  const dict = useDictionary()
  const copy = dict.speedRun
  const [username, setUsername] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch("/api/rating-speed-run/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitionId, username }),
      })
      const data = (await response.json()) as
        { ok: true; already: boolean } | { error?: string }

      if (!response.ok) {
        setError(
          translateApiError(
            "error" in data ? data.error : undefined,
            dict,
            copy.joinFailed,
          ),
        )
        return
      }

      setMessage("already" in data && data.already ? copy.already : copy.joined)
      setUsername("")
      await router.invalidate()
    } catch {
      setError(copy.joinFailed)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto]"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {copy.username}
        </span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder="@username"
          required
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="mt-auto inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {submitting ? copy.joining : copy.join}
      </button>
      {message ? (
        <p className="sm:col-span-2 text-sm text-emerald-700 dark:text-emerald-400">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="sm:col-span-2 text-sm text-rose-700 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </form>
  )
}

export function RatingSpeedRunCompetitionView({
  competition,
  showBackToList = false,
}: {
  competition: RatingSpeedRunCompetition
  showBackToList?: boolean
}) {
  const dict = useDictionary()
  const copy = dict.speedRun
  const locale = useLocale()
  const status = getCompetitionStatus(competition)
  const winner = useMemo(() => getWinner(competition), [competition])

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {showBackToList ? (
              <div className="mb-3">
                <LocaleLink
                  to="/rating-speed-run"
                  search={{}}
                  className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                >
                  {copy.backToList}
                </LocaleLink>
              </div>
            ) : null}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{competition.title}</h2>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(status)}`}
              >
                {statusLabel(status, copy)}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {fill(copy.tracking, { type: ratingTypeLabel(competition.ratingType, dict) })}
            </p>
          </div>
          {status === "registration-open" ? (
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              {fill(copy.registrationCloses, {
                time: formatDuration(competition.registrationClosesAt),
              })}
            </div>
          ) : status === "running" ? (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              {fill(copy.endsIn, { time: formatDuration(competition.endDate) })}
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {copy.registrationWindow}
            </div>
            <div className="mt-1 text-sm font-semibold">
              {formatDateTime(competition.registrationOpenedAt, locale)} {copy.to}{" "}
              {formatDateTime(competition.registrationClosesAt, locale)}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {copy.competitionStart}
            </div>
            <div className="mt-1 text-sm font-semibold">
              {formatDateTime(competition.startDate, locale)}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {copy.competitionEnd}
            </div>
            <div className="mt-1 text-sm font-semibold">
              {formatDateTime(competition.endDate, locale)}
            </div>
          </div>
        </div>

        {competition.description || competition.prize ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {competition.description ? (
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {copy.description}
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {competition.description}
                </p>
              </div>
            ) : null}
            {competition.prize ? (
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <div className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  {copy.prize}
                </div>
                <p className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
                  {competition.prize}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {status === "registration-open" ? (
          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h3 className="mb-3 text-base font-semibold">
              {copy.joinTitle}
            </h3>
            <JoinCompetitionForm competitionId={competition.id} />
          </div>
        ) : null}
      </section>

      {status === "finished" && winner ? (
        <WinnerBanner
          winner={winner}
          prize={competition.prize}
          ratingType={competition.ratingType}
        />
      ) : null}

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
          <div>
            <h3 className="text-lg font-semibold">{copy.leaderboard}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {copy.leaderboardLede}
            </p>
          </div>
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {fill(copy.playersCount, { count: competition.participants.length })}
          </div>
        </div>

        {competition.participants.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400 sm:px-6">
            {copy.noPlayers}
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 sm:hidden">
              {competition.participants.map((participant, index) => {
                const isWinner = status === "finished" && index === 0
                return (
                  <article
                    key={participant.username}
                    className={`rounded-xl border p-4 ${
                      isWinner
                        ? "border-amber-300 bg-amber-50 dark:border-amber-600/50 dark:bg-amber-950/30"
                        : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {isWinner ? (
                            <CrownIcon className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                          ) : null}
                          {fill(copy.rank, { rank: index + 1 })}
                          {isWinner ? (
                            <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                              {copy.winner}
                            </span>
                          ) : null}
                        </div>
                        <a
                          href={`https://www.chess.com/member/${encodeURIComponent(
                            participant.username,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block font-mono text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                        >
                          {participant.username}
                        </a>
                      </div>
                      <div
                        className={`text-lg font-semibold ${statColor(participant.netPoints)}`}
                      >
                        {participant.netPoints > 0 ? "+" : ""}
                        {participant.netPoints}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                        <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {copy.start}
                        </div>
                        <div className="mt-1 font-semibold tabular-nums">
                          {formatRatingValue(participant.startRating)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                        <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {copy.current}
                        </div>
                        <div className="mt-1 font-semibold tabular-nums">
                          {formatRatingValue(participant.currentRating)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                        <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {copy.gained}
                        </div>
                        <div className="mt-1 font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                          +{participant.gainedPoints}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                        <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {copy.lost}
                        </div>
                        <div className="mt-1 font-semibold tabular-nums text-rose-700 dark:text-rose-400">
                          -{participant.lostPoints}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {copy.lastSync}{" "}
                      {participant.lastSyncedAt
                        ? formatDateTime(participant.lastSyncedAt, locale)
                        : copy.waiting}
                    </div>

                    {participant.error ? (
                      <div className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                        {participant.error}
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-225 text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-3 font-medium sm:px-6">{dict.prodigeArena.player}</th>
                    <th className="px-4 py-3 font-medium">{copy.start}</th>
                    <th className="px-4 py-3 font-medium">{copy.current}</th>
                    <th className="px-4 py-3 font-medium text-emerald-700 dark:text-emerald-400">
                      {copy.gained}
                    </th>
                    <th className="px-4 py-3 font-medium text-rose-700 dark:text-rose-400">
                      {copy.lost}
                    </th>
                    <th className="px-4 py-3 font-medium">{copy.net}</th>
                    <th className="px-4 py-3 font-medium">{copy.lastSync}</th>
                  </tr>
                </thead>
                <tbody>
                  {competition.participants.map((participant, index) => {
                    const isWinner = status === "finished" && index === 0
                    return (
                      <tr
                        key={participant.username}
                        className={`border-b last:border-0 ${
                          isWinner
                            ? "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30"
                            : "border-zinc-100 dark:border-zinc-800/80"
                        }`}
                      >
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
                            {isWinner ? (
                              <CrownIcon className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
                            ) : null}
                            <a
                              href={`https://www.chess.com/member/${encodeURIComponent(
                                participant.username,
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                            >
                              {participant.username}
                            </a>
                            {isWinner ? (
                              <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                                {copy.winner}
                              </span>
                            ) : null}
                          </div>
                          {participant.error ? (
                            <div className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                              {participant.error}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                          {formatRatingValue(participant.startRating)}
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                          {formatRatingValue(participant.currentRating)}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-emerald-700 dark:text-emerald-400">
                          +{participant.gainedPoints}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-rose-700 dark:text-rose-400">
                          -{participant.lostPoints}
                        </td>
                        <td
                          className={`px-4 py-3 tabular-nums font-semibold ${statColor(participant.netPoints)}`}
                        >
                          {participant.netPoints > 0 ? "+" : ""}
                          {participant.netPoints}
                        </td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {participant.lastSyncedAt
                            ? formatDateTime(participant.lastSyncedAt, locale)
                            : copy.waiting}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
