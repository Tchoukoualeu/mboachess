import { Link } from "@tanstack/react-router"
import { GitHubLink } from "@/components/GitHubLink"
import { WhatsAppLink } from "@/components/WhatsAppLink"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-surface-muted/50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="font-display text-lg font-semibold tracking-tight text-foreground">
              Mboachess
            </p>
            <p className="mt-1.5 text-sm leading-6 text-ink-muted">
              Promoting chess for Cameroonian players—and anyone who wants to
              follow friends and teammates on Chess.com.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WhatsAppLink />
            <GitHubLink />
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-ink-muted transition hover:text-brand"
              >
                Players
              </Link>
            </li>
            <li>
              <Link
                to="/tournaments"
                className="text-ink-muted transition hover:text-brand"
              >
                Tournaments
              </Link>
            </li>
            <li>
              <Link
                to="/clubs"
                className="text-ink-muted transition hover:text-brand"
              >
                Clubs
              </Link>
            </li>
            <li>
              <Link
                to="/content-creators"
                className="text-ink-muted transition hover:text-brand"
              >
                Creators
              </Link>
            </li>
            <li>
              <Link
                to="/rating-speed-run"
                search={{}}
                className="text-ink-muted transition hover:text-brand"
              >
                Speed run
              </Link>
            </li>
            <li>
              <Link
                to="/chess-cameroon"
                className="text-ink-muted transition hover:text-brand"
              >
                Chess Cameroon
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
