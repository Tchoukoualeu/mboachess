import { Link } from "@tanstack/react-router"
import { GitHubLink } from "@/components/GitHubLink"
import { WhatsAppLink } from "@/components/WhatsAppLink"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="group shrink-0 font-display text-lg font-semibold tracking-tight text-foreground transition hover:text-brand sm:text-xl"
        >
          <span className="inline-flex items-center gap-2">
            <img
              src="/queen.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain transition group-hover:scale-105"
            />
            Mboachess
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden min-w-0 items-center gap-1 overflow-x-auto md:flex"
        >
          <Link
            to="/"
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
            activeOptions={{ exact: true }}
          >
            Players
          </Link>
          <Link
            to="/tournaments"
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
          >
            Tournaments
          </Link>
          <Link
            to="/clubs"
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
          >
            Clubs
          </Link>
          <Link
            to="/content-creators"
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
          >
            Creators
          </Link>
          <Link
            to="/rating-speed-run"
            search={{}}
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
          >
            Speed run
          </Link>
          <Link
            to="/chess-cameroon"
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
          >
            Chess Cameroon
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 md:ml-1">
          <WhatsAppLink />
          <GitHubLink />
        </div>
      </div>

      <nav
        aria-label="Mobile"
        className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 py-2 md:hidden"
      >
        <Link
          to="/"
          className="shrink-0 rounded-md px-2.5 py-1 text-xs text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
          activeOptions={{ exact: true }}
        >
          Players
        </Link>
        <Link
          to="/tournaments"
          className="shrink-0 rounded-md px-2.5 py-1 text-xs text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
        >
          Tournaments
        </Link>
        <Link
          to="/clubs"
          className="shrink-0 rounded-md px-2.5 py-1 text-xs text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
        >
          Clubs
        </Link>
        <Link
          to="/content-creators"
          className="shrink-0 rounded-md px-2.5 py-1 text-xs text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
        >
          Creators
        </Link>
        <Link
          to="/rating-speed-run"
          search={{}}
          className="shrink-0 rounded-md px-2.5 py-1 text-xs text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
        >
          Speed run
        </Link>
        <Link
          to="/chess-cameroon"
          className="shrink-0 rounded-md px-2.5 py-1 text-xs text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"
        >
          Chess Cameroon
        </Link>
      </nav>
    </header>
  )
}
