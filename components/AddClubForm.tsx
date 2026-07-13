import { useRouter } from "@tanstack/react-router"
import { useState } from "react"

export function AddClubForm() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    meetingSchedule: "",
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
      setMessage({ type: "err", text: "Club name is required." })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/submit-club", {
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
        text: "Club added successfully!",
      })
      setFormData({
        name: "",
        location: "",
        description: "",
        contactName: "",
        email: "",
        phone: "",
        website: "",
        meetingSchedule: "",
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
          <h2 className="text-lg font-semibold">Add Your Chess Club</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Share your club with the community
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
              Club Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Yaoundé Chess Club"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
            />
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
              htmlFor="meetingSchedule"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Meeting Schedule
            </label>
            <input
              id="meetingSchedule"
              name="meetingSchedule"
              type="text"
              placeholder="e.g. Every Saturday at 2 PM"
              value={formData.meetingSchedule}
              onChange={(e) =>
                setFormData({ ...formData, meetingSchedule: e.target.value })
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
              placeholder="Brief description of your club..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contactName"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Contact Person
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                placeholder="Contact name"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                disabled={loading}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Phone
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="club@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://..."
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                disabled={loading}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            {loading ? "Adding…" : "Add Club"}
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
