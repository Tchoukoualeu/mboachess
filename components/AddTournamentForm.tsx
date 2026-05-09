"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function AddTournamentForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    link: "",
  })
  const [message, setMessage] = useState<{
    type: "ok" | "err"
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

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
        body: JSON.stringify(formData),
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
      })
      router.refresh()
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold">Add New Tournament</h2>
      <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Start Date *
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
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              End Date
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
            placeholder="e.g. https://chess.com/tournament/..."
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
      </form>
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
    </div>
  )
}
