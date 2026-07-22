import { useRouter } from "@tanstack/react-router"
import { useState, useEffect, useMemo } from "react"
import {
  getUserTimezone,
  getTimezoneName,
  previewGermanTime,
} from "@/lib/utils"

export function AddTournamentForm() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    link: "",
    phone: "",
    isOnline: false,
  })
  const [message, setMessage] = useState<{
    type: "ok" | "err"
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [userTimezone, setUserTimezone] = useState<string>("UTC")

  // Detect user's timezone on component mount
  useEffect(() => {
    setUserTimezone(getUserTimezone())
  }, [])

  // Preview German time for start and end dates
  const startDateGermanPreview = useMemo(
    () => previewGermanTime(formData.startDate, userTimezone),
    [formData.startDate, userTimezone],
  )

  const endDateGermanPreview = useMemo(
    () => previewGermanTime(formData.endDate, userTimezone),
    [formData.endDate, userTimezone],
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (!formData.name.trim()) {
      setMessage({ type: "err", text: "Tournament name is required." })
      return
    }

    if (!formData.startDate) {
      setMessage({ type: "err", text: "Start date is required." })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/submit-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userTimezone, // Include user's timezone for server-side conversion
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        ok?: boolean
      }
      if (!res.ok) {
        setMessage({
          type: "err",
          text: data.error || "Request failed",
        })
        return
      }
      setMessage({
        type: "ok",
        text: "Tournament added successfully!",
      })
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        link: "",
        phone: "",
        isOnline: false,
      })
      await router.invalidate()
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 sm:p-6"
      >
        <div>
          <h2 className="text-lg font-semibold">Add New Tournament</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Submit your own tournament to share with the community
          </p>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-zinc-600 transition-transform dark:text-zinc-400 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <form
          onSubmit={onSubmit}
          className="space-y-4 border-t border-zinc-200 p-4 dark:border-zinc-800 sm:p-6"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Tournament Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. National Chess Championship 2026"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
            />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              <strong>Your timezone:</strong> {getTimezoneName(userTimezone)} (
              {userTimezone})
            </p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Enter times in your local time. They will be stored in UTC and
              displayed in your timezone when viewing.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Start Date * (Your Time)
              </label>
              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                disabled={loading}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              />
              {startDateGermanPreview && (
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                  → German time: {startDateGermanPreview}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                End Date (Your Time)
              </label>
              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                disabled={loading}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              />
              {endDateGermanPreview && (
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                  → German time: {endDateGermanPreview}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Yaoundé, Cameroon"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isOnline"
              name="isOnline"
              type="checkbox"
              checked={formData.isOnline}
              onChange={(e) =>
                setFormData({ ...formData, isOnline: e.target.checked })
              }
              disabled={loading}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-emerald-600"
            />
            <label
              htmlFor="isOnline"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              This is an online tournament
            </label>
          </div>

          <div>
            <label
              htmlFor="link"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Tournament Link
            </label>
            <input
              id="link"
              name="link"
              type="url"
              placeholder="e.g. https://www.chess.com/tournament/..."
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
            />
            {formData.isOnline && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Use a Chess.com tournament URL so winners can be fetched
                automatically for past online events.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Contact Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +237 659 46 17 38"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Brief description of the tournament..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            {loading ? "Adding…" : "Add Tournament"}
          </button>

          {message ? (
            <p
              role="status"
              className={`mt-3 text-sm ${
                message.type === "ok"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {message.text}
            </p>
          ) : null}
        </form>
      )}
    </div>
  )
}
