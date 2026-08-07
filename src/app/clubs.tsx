import { createFileRoute } from "@tanstack/react-router"
import { AddClubForm } from "@/components/AddClubForm"
import { PageShell } from "@/components/PageShell"
import { loadClubs } from "@/server/clubs"
import { pageHead, webPageJsonLd } from "@/lib/seo"

const TITLE = "Chess Clubs in Cameroon | mboachess"
const DESCRIPTION =
  "Find and join chess clubs across Cameroon. Discover meeting schedules, locations, and contact details for local chess communities."

export const Route = createFileRoute("/clubs")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/clubs",
      jsonLd: webPageJsonLd({
        title: TITLE,
        description: DESCRIPTION,
        path: "/clubs",
      }),
    }),
  loader: () => loadClubs(),
  component: ClubsPage,
})

function ClubsPage() {
  const clubs = Route.useLoaderData()

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Chess clubs
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          Find and join clubs in your area. Add yours to connect with other
          players.
        </p>
      </header>

      <AddClubForm />

      {clubs.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">
          No clubs yet. Be the first to add your chess club!
        </p>
      ) : (
        <section aria-labelledby="clubs-heading" className="space-y-4">
          <h2 id="clubs-heading" className="text-sm font-medium text-ink-muted">
            All clubs ({clubs.length})
          </h2>
          {clubs.map((club, index) => (
            <article
              key={index}
              className="rounded-xl border border-border bg-surface p-4 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {club.name}
              </h3>
              {club.description && (
                <p className="mt-1 text-sm text-ink-muted">{club.description}</p>
              )}
              <div className="mt-3 space-y-1.5 text-sm text-foreground/90">
                {club.location && <div>{club.location}</div>}
                {club.meetingSchedule && <div>{club.meetingSchedule}</div>}
                {club.contactName && <div>Contact: {club.contactName}</div>}
                {club.phone && (
                  <a
                    href={`tel:${club.phone}`}
                    className="text-brand hover:underline"
                  >
                    {club.phone}
                  </a>
                )}
                {club.email && (
                  <div>
                    <a
                      href={`mailto:${club.email}`}
                      className="text-brand hover:underline"
                    >
                      {club.email}
                    </a>
                  </div>
                )}
                {club.website && (
                  <div>
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                    >
                      Visit website
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </PageShell>
  )
}
