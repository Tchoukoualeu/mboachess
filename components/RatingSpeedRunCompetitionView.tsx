import { Link, useRouter } from "@tanstack/react-router"
import { useMemo, useState, type FormEvent } from "react"
import {
  getCompetitionStatus,
  type CompetitionStatus,
  type RatingSpeedRunCompetition,
  type RatingType,
} from "@/lib/ratingSpeedRunShared"

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
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
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    case "upcoming":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    case "running":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    case "finished":
      return "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  }
}

function ratingTypeLabel(ratingType: RatingType): string {
  return ratingType.charAt(0).toUpperCase() + ratingType.slice(1)
}

function getWinner(competition: RatingSpeedRunCompetition | null) {
  if (!competition || competition.participants.length === 0) return null
  return competition.participants[0]
}

function JoinCompetitionForm({ competitionId }: { competitionId: string }) {
  const router = useRouter()
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
          "error" in data && data.error
            ? data.error
            : "Could not join competition.",
        )
        return
      }

      setMessage(
        "already" in data && data.already
          ? "This account is already registered."
          : "Registration complete.",
      )
      setUsername("")
      await router.invalidate()
    } catch {
      setError("Could not join competition.")
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
          Chess.com username
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
        className="mt-auto inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        {submitting ? "Joining..." : "Join competition"}
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
  const status = getCompetitionStatus(competition)
  const winner = useMemo(() => getWinner(competition), [competition])

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {showBackToList ? (
              <div className="mb-3">
                <Link
                  to="/rating-speed-run"
                  className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                >
                  Back to all speed runs
                </Link>
              </div>
            ) : null}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{competition.title}</h2>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(status)}`}
              >
                {statusLabel(status)}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Tracking {ratingTypeLabel(competition.ratingType)} rating.
            </p>
          </div>
          {status === "registration-open" ? (
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Registration closes in{" "}
              {formatDuration(competition.registrationClosesAt)}
            </div>
          ) : status === "running" ? (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              Ends in {formatDuration(competition.endDate)}
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Registration window
            </div>
            <div className="mt-1 text-sm font-semibold">
              {formatDateTime(competition.registrationOpenedAt)} to{" "}
              {formatDateTime(competition.registrationClosesAt)}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Competition start
            </div>
            <div className="mt-1 text-sm font-semibold">
              {formatDateTime(competition.startDate)}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Competition end
            </div>
            <div className="mt-1 text-sm font-semibold">
              {formatDateTime(competition.endDate)}
            </div>
          </div>
        </div>

        {competition.description || competition.prize ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {competition.description ? (
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Description
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {competition.description}
                </p>
              </div>
            ) : null}
            {competition.prize ? (
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <div className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  Prize
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
              Join this competition
            </h3>
            <JoinCompetitionForm competitionId={competition.id} />
          </div>
        ) : null}

        {status === "finished" && winner ? (
          <div className="mt-6 rounded-xl bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
            Winner: <span className="font-semibold">{winner.username}</span>{" "}
            with <span className="font-semibold">+{winner.netPoints}</span>{" "}
            points.
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
          <div>
            <h3 className="text-lg font-semibold">Leaderboard</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Sorted by highest net gain from the competition start.
            </p>
          </div>
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Players: {competition.participants.length}
          </div>
        </div>

        {competition.participants.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400 sm:px-6">
            No players registered yet.
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 sm:hidden">
              {competition.participants.map((participant, index) => (
                <article
                  key={participant.username}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Rank #{index + 1}
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
                        Start
                      </div>
                      <div className="mt-1 font-semibold tabular-nums">
                        {formatRatingValue(participant.startRating)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                      <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Current
                      </div>
                      <div className="mt-1 font-semibold tabular-nums">
                        {formatRatingValue(participant.currentRating)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                      <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Gained
                      </div>
                      <div className="mt-1 font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                        +{participant.gainedPoints}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                      <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Lost
                      </div>
                      <div className="mt-1 font-semibold tabular-nums text-rose-700 dark:text-rose-400">
                        -{participant.lostPoints}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    Last sync:{" "}
                    {participant.lastSyncedAt
                      ? formatDateTime(participant.lastSyncedAt)
                      : "Waiting for start"}
                  </div>

                  {participant.error ? (
                    <div className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                      {participant.error}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-225 text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-3 font-medium sm:px-6">Player</th>
                    <th className="px-4 py-3 font-medium">Start</th>
                    <th className="px-4 py-3 font-medium">Current</th>
                    <th className="px-4 py-3 font-medium text-emerald-700 dark:text-emerald-400">
                      Gained
                    </th>
                    <th className="px-4 py-3 font-medium text-rose-700 dark:text-rose-400">
                      Lost
                    </th>
                    <th className="px-4 py-3 font-medium">Net</th>
                    <th className="px-4 py-3 font-medium">Last sync</th>
                  </tr>
                </thead>
                <tbody>
                  {competition.participants.map((participant) => (
                    <tr
                      key={participant.username}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                    >
                      <td className="px-4 py-3 sm:px-6">
                        <div className="font-mono text-xs sm:text-sm">
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
                          ? formatDateTime(participant.lastSyncedAt)
                          : "Waiting for start"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
