import { useRouter, useRouterState } from "@tanstack/react-router"
import { localeFromPath, localizePath, stripLocale, useDictionary } from "@/lib/i18n"

export function LanguageSwitcher() {
  const dict = useDictionary()
  const router = useRouter()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const searchStr = useRouterState({ select: (state) => state.location.searchStr })
  const locale = localeFromPath(pathname)
  const bare = stripLocale(pathname)

  function href(next: "fr" | "en") {
    return localizePath(bare, next) + (searchStr || "")
  }

  function go(event: React.MouseEvent<HTMLAnchorElement>, next: "fr" | "en") {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }
    event.preventDefault()
    void router.navigate({ href: href(next) })
  }

  return (
    <nav aria-label={dict.nav.language} className="inline-flex items-center gap-1 text-sm">
      <LocaleChoice
        code="fr"
        label="FR"
        current={locale === "fr"}
        href={href("fr")}
        onClick={(event) => go(event, "fr")}
      />
      <span aria-hidden className="text-border">
        |
      </span>
      <LocaleChoice
        code="en"
        label="EN"
        current={locale === "en"}
        href={href("en")}
        onClick={(event) => go(event, "en")}
      />
    </nav>
  )
}

function LocaleChoice({
  code,
  label,
  current,
  href,
  onClick,
}: {
  code: "fr" | "en"
  label: string
  current: boolean
  href: string
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <a
      href={href}
      hrefLang={code}
      lang={code}
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={`rounded px-1 py-0.5 ${
        current ? "font-semibold text-brand" : "text-ink-muted hover:text-brand"
      }`}
    >
      {label}
    </a>
  )
}
