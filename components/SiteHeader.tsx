import { Link, useRouterState } from "@tanstack/react-router"
import { useEffect, useId, useState } from "react"
import { GitHubLink } from "@/components/GitHubLink"
import { WhatsAppLink } from "@/components/WhatsAppLink"

const linkClass =
  "rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"

const mobileLinkClass =
  "block rounded-lg px-3 py-3 text-base text-foreground transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-2 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="group min-w-0 shrink font-display text-lg font-semibold tracking-tight text-foreground transition hover:text-brand sm:text-xl"
          onClick={() => setOpen(false)}
        >
          <span className="inline-flex items-center gap-2">
            <img
              src="/queen.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain transition group-hover:scale-105"
            />
            <span className="truncate">Mboachess</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-1 md:flex"
        >
          <Link to="/" className={linkClass} activeOptions={{ exact: true }}>
            Players
          </Link>
          <Link to="/tournaments" className={linkClass}>
            Tournaments
          </Link>
          <Link to="/clubs" className={linkClass}>
            Clubs
          </Link>
          <Link to="/content-creators" className={linkClass}>
            Creators
          </Link>
          <Link to="/rating-speed-run" search={{}} className={linkClass}>
            Speed run
          </Link>
          <Link to="/chess-cameroon" className={linkClass}>
            Chess Cameroon
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-1">
          <WhatsAppLink />
          <GitHubLink />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-ink-muted transition hover:border-brand/40 hover:text-brand md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id={menuId}
          aria-label="Mobile"
          className="border-t border-border/60 px-3 py-2 md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-4xl flex-col gap-0.5 sm:px-3">
            <li>
              <Link
                to="/"
                className={mobileLinkClass}
                activeOptions={{ exact: true }}
                onClick={() => setOpen(false)}
              >
                Players
              </Link>
            </li>
            <li>
              <Link
                to="/tournaments"
                className={mobileLinkClass}
                onClick={() => setOpen(false)}
              >
                Tournaments
              </Link>
            </li>
            <li>
              <Link
                to="/clubs"
                className={mobileLinkClass}
                onClick={() => setOpen(false)}
              >
                Clubs
              </Link>
            </li>
            <li>
              <Link
                to="/content-creators"
                className={mobileLinkClass}
                onClick={() => setOpen(false)}
              >
                Creators
              </Link>
            </li>
            <li>
              <Link
                to="/rating-speed-run"
                search={{}}
                className={mobileLinkClass}
                onClick={() => setOpen(false)}
              >
                Speed run
              </Link>
            </li>
            <li>
              <Link
                to="/chess-cameroon"
                className={mobileLinkClass}
                onClick={() => setOpen(false)}
              >
                Chess Cameroon
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
