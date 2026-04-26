"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubmitUsernameForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const username = value.trim();
    if (!username) {
      setMessage({ type: "err", text: "Enter your Chess.com username." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
        already?: boolean;
      };
      if (!res.ok) {
        setMessage({
          type: "err",
          text: data.error || "Request failed",
        });
        return;
      }
      if (data.already) {
        setMessage({
          type: "ok",
          text: "That username is already in the list.",
        });
        setValue("");
        router.refresh();
        return;
      }
      setMessage({
        type: "ok",
        text: "Your username was added. It will show in the table below.",
      });
      setValue("");
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 max-w-xl sm:mb-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="chess-username"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Add your Chess.com username
          </label>
          <input
            id="chess-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="e.g. hikaru"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-10 shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </form>
      {message ? (
        <p
          role="status"
          className={`mt-2 text-sm ${
            message.type === "ok"
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
