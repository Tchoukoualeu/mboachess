import { createFileRoute } from "@tanstack/react-router"
import { AddContentCreatorForm } from "@/components/AddContentCreatorForm"
import { PageShell } from "@/components/PageShell"
import { fill, getDictionary, useDictionary, useRouteLoaderData, type Locale } from "@/lib/i18n"
import { loadContentCreators } from "@/server/contentCreators"
import { pageHead, webPageJsonLd } from "@/lib/seo"

export function creatorsHead(locale: Locale) {
  const copy = getDictionary(locale).creators
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/content-creators",
    locale,
    jsonLd: webPageJsonLd({
      title: copy.metaTitle,
      description: copy.metaDescription,
      path: "/content-creators",
      locale,
    }),
  })
}

export const Route = createFileRoute("/content-creators")({
  head: () => creatorsHead("fr"),
  loader: () => loadContentCreators(),
  component: ContentCreatorsPage,
})

export function ContentCreatorsPage() {
  const dict = useDictionary()
  const copy = dict.creators
  const creators = useRouteLoaderData<Awaited<ReturnType<typeof loadContentCreators>>>()

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.lede}
        </p>
      </header>

      <AddContentCreatorForm />

      {creators.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">
          {copy.empty}
        </p>
      ) : (
        <section aria-labelledby="creators-heading" className="space-y-4">
          <h2
            id="creators-heading"
            className="text-sm font-medium text-ink-muted"
          >
            {fill(copy.all, { count: creators.length })}
          </h2>
          {creators.map((creator, index) => (
            <article
              key={index}
              className="rounded-xl border border-border bg-surface p-4 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {creator.name}
              </h3>
              {creator.contentType && (
                <p className="mt-0.5 text-xs text-brand">{creator.contentType}</p>
              )}
              {creator.description && (
                <p className="mt-1 text-sm text-ink-muted">
                  {creator.description}
                </p>
              )}

              <div className="mt-3 space-y-1.5 text-sm">
                {creator.phone && (
                  <a
                    href={`tel:${creator.phone}`}
                    className="block text-brand hover:underline"
                  >
                    {creator.phone}
                  </a>
                )}
                {creator.email && (
                  <a
                    href={`mailto:${creator.email}`}
                    className="block text-brand hover:underline"
                  >
                    {creator.email}
                  </a>
                )}
                {creator.website && (
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                  >
                    {dict.common.visitWebsite}
                  </a>
                )}
              </div>

              {(creator.youtube ||
                creator.twitch ||
                creator.twitter ||
                creator.instagram ||
                creator.facebook) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {creator.youtube && (
                    <a
                      href={creator.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-brand/40"
                    >
                      YouTube
                    </a>
                  )}
                  {creator.twitch && (
                    <a
                      href={creator.twitch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-brand/40"
                    >
                      Twitch
                    </a>
                  )}
                  {creator.twitter && (
                    <a
                      href={creator.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-brand/40"
                    >
                      Twitter
                    </a>
                  )}
                  {creator.instagram && (
                    <a
                      href={creator.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-brand/40"
                    >
                      Instagram
                    </a>
                  )}
                  {creator.facebook && (
                    <a
                      href={creator.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-brand/40"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </PageShell>
  )
}
