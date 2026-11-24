import type { ReactNode } from "react"
import { LocaleLink } from "@/components/LocaleLink"
import { useDictionary } from "@/lib/i18n"
import type { SiteLink } from "@/lib/navigation"

type Props = {
  item: SiteLink
  className?: string
  onClick?: () => void
  children?: ReactNode
}

export function SiteNavLink({ item, className, onClick, children }: Props) {
  const dict = useDictionary()
  const content = children ?? dict.nav.links[item.id].label

  return (
    <LocaleLink
      to={item.to}
      search={item.to === "/rating-speed-run" ? {} : undefined}
      className={className}
      onClick={onClick}
      activeOptions={{ exact: item.to === "/" }}
    >
      {content}
    </LocaleLink>
  )
}
