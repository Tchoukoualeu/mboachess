import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import type { SiteLink } from "@/lib/navigation"

type Props = {
  item: SiteLink
  className?: string
  onClick?: () => void
  children?: ReactNode
}

export function SiteNavLink({ item, className, onClick, children }: Props) {
  const content = children ?? item.label

  // This route validates search params, so the link must pass an explicit object.
  if (item.to === "/rating-speed-run") {
    return (
      <Link
        to="/rating-speed-run"
        search={{}}
        className={className}
        onClick={onClick}
      >
        {content}
      </Link>
    )
  }

  return (
    <Link
      to={item.to}
      className={className}
      onClick={onClick}
      activeOptions={{ exact: item.to === "/" }}
    >
      {content}
    </Link>
  )
}
