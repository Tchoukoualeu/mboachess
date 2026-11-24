import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { localizePath, useLocale } from "@/lib/i18n"

type Props = {
  to: string
  params?: Record<string, string>
  search?: Record<string, unknown>
  className?: string
  activeOptions?: { exact?: boolean }
  onClick?: () => void
  children: ReactNode
}

export function LocaleLink({
  to,
  params,
  search,
  className,
  activeOptions,
  onClick,
  children,
}: Props) {
  const locale = useLocale()
  const href = localizePath(to, locale)

  return (
    <Link
      to={href as never}
      params={params as never}
      search={search as never}
      className={className}
      activeOptions={activeOptions ?? { exact: stripHome(to) }}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

function stripHome(to: string): boolean {
  return to === "/"
}
