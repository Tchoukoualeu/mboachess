import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"
import { pageHead } from "@/lib/seo"
import {
  getCompetitionStatus,
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
    <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Create a new speed run</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Registration opens immediately and closes after 24 hours. The
          competition then runs for exactly 3 days.
        </p>
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="Rating speed run"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Rating type
          </span>
          <select
            value={ratingType}
            onChange={(event) =>
              setRatingType(event.target.value as RatingType)
            }
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="blitz">Blitz</option>
            <option value="rapid">Rapid</option>
            <option value="bullet">Bullet</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="Explain the format, rules, and what players should know about this speed run."
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Prize
          </span>
          <input
            value={prize}
            onChange={(event) => setPrize(event.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="Example: 25,000 FCFA + trophy"
          />
        </label>

        <div className="sm:col-span-2 rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
          Every speed run follows the same schedule: 24 hours to register, then
          3 days of rating competition.
        </div>

        <div className="sm:col-span-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Creating..." : "Create competition"}
          </button>
          {message ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
          ) : null}
        </div>
      </form>
    </section>
  )
}

export const Route = createFileRoute("/rating-speed-run/")({
  head: () =>
    pageHead({
      title: "Rating speed run | mboachess",
      description:
        "Create and track rating speed run competitions using Chess.com accounts.",
      path: "/rating-speed-run",
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
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2">
              <Link
                to="/"
                className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
              >
                Back to Home
              </Link>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Rating speed run
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Contestants register with a Chess.com account during a 24-hour
              signup window. Once registration closes, the speed run lasts 3
              days and the player with the highest net rating gain wins.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <div className="font-medium">Eligibility</div>
            <div>
              Chess.com account must be at least 3 months old at start time.
            </div>
          </div>
        </header>

        {isAdmin ? <CreateCompetitionForm /> : null}

        {competitions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
            {isAdmin
              ? "No competition yet. Create one above to open registration."
              : "No competition yet. Check back soon."}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Speed run competitions ({competitions.length})
            </div>
            {competitions.map((competition) => {
              const status = getCompetitionStatus(competition)
              return (
                <Link
                  key={competition.id}
                  to="/rating-speed-run/$id"
                  params={{ id: competition.id }}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          {competition.title}
                        </h2>
                        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {ratingTypeLabel(competition.ratingType)} rating
                      </p>
                      {competition.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {competition.description}
                        </p>
                      ) : null}
                      <div className="mt-3 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300 sm:grid-cols-2">
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
                    <div className="shrink-0 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Open competition →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
