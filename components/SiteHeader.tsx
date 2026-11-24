import { useRouterState } from "@tanstack/react-router"
import { useEffect, useId, useState } from "react"
import { GitHubLink } from "@/components/GitHubLink"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { LocaleLink } from "@/components/LocaleLink"
import { SiteNavLink } from "@/components/SiteNavLink"
import { WhatsAppLink } from "@/components/WhatsAppLink"
import { useDictionary } from "@/lib/i18n"
import { SITE_LINKS } from "@/lib/navigation"

const linkClass =
  "shrink-0 whitespace-nowrap rounded-md px-2 py-1.5 text-sm text-ink-muted transition hover:bg-brand-muted hover:text-brand [&.active]:bg-brand-muted [&.active]:font-medium [&.active]:text-brand"

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
  const dict = useDictionary()
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
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <LocaleLink
          to="/"
          className="group shrink-0 font-display text-lg font-semibold tracking-tight text-foreground transition hover:text-brand sm:text-xl"
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
            <span>Mboachess</span>
          </span>
        </LocaleLink>

        <nav
          aria-label={dict.nav.primary}
          className="ml-auto hidden items-center gap-1 lg:flex"
        >
          {SITE_LINKS.filter((item) => item.inHeader).map((item) => (
            <SiteNavLink key={item.to} item={item} className={linkClass} />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-1">
          <LanguageSwitcher />
          <WhatsAppLink />
          <GitHubLink />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-ink-muted transition hover:border-brand/40 hover:text-brand lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id={menuId}
          aria-label={dict.nav.mobile}
          className="border-t border-border/60 px-3 py-2 lg:hidden"
        >
          <ul className="mx-auto flex w-full max-w-4xl flex-col gap-0.5 sm:px-3">
            {SITE_LINKS.filter((item) => item.to !== "/prodige-league").map((item) => (
              <li key={item.to}>
                <SiteNavLink
                  item={item}
                  className={mobileLinkClass}
                  onClick={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
