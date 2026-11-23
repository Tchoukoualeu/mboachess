import { useRouter } from "@tanstack/react-router";
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
        await router.invalidate();
        return;
      }
      setMessage({
        type: "ok",
        text: "Your username was added. It will show in the ratings table.",
      });
      setValue("");
      await router.invalidate();
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="chess-username"
            className="mb-1 block text-sm font-medium text-foreground"
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
            className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono text-sm text-foreground shadow-sm placeholder:text-ink-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-10 shrink-0 rounded-lg bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add player"}
        </button>
      </form>
      {message ? (
        <p
          role="status"
          className={`mt-2 text-sm ${
            message.type === "ok"
              ? "text-brand"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
