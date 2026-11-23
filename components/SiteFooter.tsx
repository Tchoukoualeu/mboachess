import { GitHubLink } from "@/components/GitHubLink"
import { SiteNavLink } from "@/components/SiteNavLink"
import { WhatsAppLink } from "@/components/WhatsAppLink"
import { SITE_LINKS } from "@/lib/navigation"

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
            {SITE_LINKS.map((item) => (
              <li key={item.to}>
                <SiteNavLink
                  item={item}
                  className="text-ink-muted transition hover:text-brand"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
