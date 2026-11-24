import { createFileRoute } from "@tanstack/react-router"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import { getDictionary, localizePath, useDictionary, type Locale } from "@/lib/i18n"
import { pageHead, SITE_URL } from "@/lib/seo"

export function chessCameroonHead(locale: Locale) {
  const copy = getDictionary(locale).chessCameroon
  const path = localizePath("/chess-cameroon", locale)
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/chess-cameroon",
    locale,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: copy.metaTitle,
      description: copy.metaDescription,
      inLanguage: locale,
      url: `${SITE_URL}${path}`,
      publisher: {
        "@type": "Organization",
        name: "mboachess",
        url: SITE_URL,
      },
    },
  })
}

export const Route = createFileRoute("/chess-cameroon")({
  head: () => chessCameroonHead("fr"),
  component: ChessCameroonPage,
})

export function ChessCameroonPage() {
  const copy = useDictionary().chessCameroon
  return (
    <PageShell>
      <header className="space-y-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {copy.title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.lede}
        </p>
        <div className="flex flex-wrap gap-3 pt-1 text-sm">
          <LocaleLink
            to="/"
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground transition hover:border-brand/40"
          >
            {copy.lookup}
          </LocaleLink>
          <a
            href="https://www.chess.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground transition hover:border-brand/40"
          >
            {copy.play}
          </a>
        </div>
      </header>

      <section className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {copy.whereTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{copy.whereBody}</p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{copy.whereTip}</p>
          <LocaleLink
            to="/clubs"
            className="mt-3 inline-block text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {copy.browseClubs}
          </LocaleLink>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {copy.followTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{copy.followBody}</p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{copy.followSubmit}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <LocaleLink
              to="/top-cameroon-chess-players"
              className="inline-block text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {copy.topLink}
            </LocaleLink>
            <LocaleLink
              to="/"
              className="inline-block text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {copy.ratingsLink}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          {copy.newTitle}
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">{copy.newLede}</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-ink-muted">
          <li>{copy.step1}</li>
          <li>{copy.step2}</li>
          <li>{copy.step3}</li>
        </ol>
        <p className="mt-4 text-sm leading-6 text-ink-muted">
          {copy.also}{" "}
          <LocaleLink
            to="/tournaments"
            className="text-brand underline underline-offset-2"
          >
            {copy.tournaments}
          </LocaleLink>{" "}
          {copy.and}{" "}
          <LocaleLink
            to="/content-creators"
            className="text-brand underline underline-offset-2"
          >
            {copy.creators}
          </LocaleLink>
          .
        </p>
      </section>
    </PageShell>
  )
}
