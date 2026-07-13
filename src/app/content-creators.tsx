import { createFileRoute, Link } from "@tanstack/react-router"
import { AddContentCreatorForm } from "@/components/AddContentCreatorForm"
import { loadContentCreators } from "@/server/contentCreators"
import { pageHead } from "@/lib/seo"

export const Route = createFileRoute("/content-creators")({
  head: () =>
    pageHead({
      title: "Chess Content Creators in Cameroon | mboachess",
      description:
        "Discover chess content creators from Cameroon. Find YouTube channels, streams, and social profiles from the local chess community.",
      path: "/content-creators",
    }),
  loader: () => loadContentCreators(),
  component: ContentCreatorsPage,
})

function ContentCreatorsPage() {
  const creators = Route.useLoaderData()

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-4 sm:mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Content Creators
            </h1>
            <Link
              to="/"
              className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
            >
              Back to Home
            </Link>
          </div>
          <p className="max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400">
            Discover chess content creators from Cameroon. Share your content
            and connect with the community.
          </p>
        </header>

        <AddContentCreatorForm />

        {creators.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-zinc-600 dark:text-zinc-400">
              No content creators yet. Be the first to add your profile!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              All Creators ({creators.length})
            </div>
            {creators.map((creator, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {creator.name}
                    </h3>
                    {creator.contentType && (
                      <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                        {creator.contentType}
                      </p>
                    )}
                    {creator.description && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {creator.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm">
                    {creator.phone && (
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <svg
                          className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <a
                          href={`tel:${creator.phone}`}
                          className="text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          {creator.phone}
                        </a>
                      </div>
                    )}

                    {creator.email && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <a
                          href={`mailto:${creator.email}`}
                          className="text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          {creator.email}
                        </a>
                      </div>
                    )}

                    {creator.website && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <a
                          href={creator.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {(creator.youtube ||
                    creator.twitch ||
                    creator.twitter ||
                    creator.instagram ||
                    creator.facebook) && (
                    <div>
                      <div className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Social Media
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {creator.youtube && (
                          <a
                            href={creator.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            YouTube
                          </a>
                        )}

                        {creator.twitch && (
                          <a
                            href={creator.twitch}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            Twitch
                          </a>
                        )}

                        {creator.twitter && (
                          <a
                            href={creator.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            Twitter
                          </a>
                        )}

                        {creator.instagram && (
                          <a
                            href={creator.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            Instagram
                          </a>
                        )}

                        {creator.facebook && (
                          <a
                            href={creator.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            Facebook
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
