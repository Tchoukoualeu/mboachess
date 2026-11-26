import { createFileRoute } from "@tanstack/react-router"
import { EloGainChart, formatEloGain } from "@/components/EloGainChart"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import {
  fill,
  getDictionary,
  intlLocale,
  useDictionary,
  useLocale,
  useRouteLoaderData,
  type Locale,
} from "@/lib/i18n"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { loadEloGains, type EloGainsPageData } from "@/server/eloGains"

export function eloGainsHead(locale: Locale) {
  const copy = getDictionary(locale).eloGains
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/elo-gains",
    locale,
    jsonLd: webPageJsonLd({
      title: copy.metaTitle,
      description: copy.metaDescription,
      path: "/elo-gains",
      locale,
    }),
  })
}

function readMonth(search: Record<string, unknown>): { month?: string } {
  if (typeof search.month === "string" && /^\d{4}-\d{2}$/.test(search.month)) {
    return { month: search.month }
  }
  return {}
}

export const Route = createFileRoute("/elo-gains")({
  head: () => eloGainsHead("fr"),
  validateSearch: readMonth,
  loaderDeps: ({ search }) => ({ month: search.month }),
  loader: ({ deps }) => loadEloGains({ data: deps.month ?? "" }),
  component: EloGainsPage,
})

function formatMonth(month: string, locale: Locale): string {
  const [year, monthIndex] = month.split("-").map(Number)
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex - 1, 1)))
}

export function EloGainsPage() {
  const dict = useDictionary()
  const copy = dict.eloGains
  const locale = useLocale()
  const data = useRouteLoaderData<EloGainsPageData>()

  return (
    <PageShell wide>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{copy.lede}</p>
      </header>

      {data.month == null ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-ink-muted">
          {copy.waiting}
        </p>
      ) : (
        <>
          <nav aria-label={copy.months} className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {data.months.map((month) => {
              const selected = month === data.month
              return (
                <LocaleLink
                  key={month}
                  to="/elo-gains"
                  search={{ month }}
                  className={
                    selected
                      ? "shrink-0 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white"
                      : "shrink-0 rounded-lg bg-surface-muted px-3 py-1.5 text-sm text-ink-muted hover:text-brand"
                  }
                >
                  {formatMonth(month, locale)}
                </LocaleLink>
              )
            })}
          </nav>

          <div className="space-y-6">
            <EloGainChart
              month={data.month}
              title={dict.common.rapid}
              empty={fill(copy.empty, { cadence: dict.common.rapid })}
              aria={fill(copy.aria, {
                cadence: dict.common.rapid,
                month: formatMonth(data.month, locale),
              })}
              series={data.rapid}
              gainText={(gain) => fill(copy.gain, { gain: formatEloGain(gain) })}
            />
            <EloGainChart
              month={data.month}
              title={dict.common.blitz}
              empty={fill(copy.empty, { cadence: dict.common.blitz })}
              aria={fill(copy.aria, {
                cadence: dict.common.blitz,
                month: formatMonth(data.month, locale),
              })}
              series={data.blitz}
              gainText={(gain) => fill(copy.gain, { gain: formatEloGain(gain) })}
            />
          </div>
        </>
      )}
    </PageShell>
  )
}
