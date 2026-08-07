import type { ReactNode } from "react"

type PageShellProps = {
  children: ReactNode
  /** Wider content column (speed-run pages). */
  wide?: boolean
  className?: string
}

export function PageShell({
  children,
  wide = false,
  className = "",
}: PageShellProps) {
  return (
    <main
      className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 ${
        wide ? "max-w-5xl" : "max-w-4xl"
      } ${className}`}
    >
      {children}
    </main>
  )
}
