import { NextResponse } from "next/server"
import { saveContentCreator } from "@/lib/contentCreators"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const data = body as Record<string, unknown>

  if (!data.name || typeof data.name !== "string") {
    return NextResponse.json(
      { error: "Missing content creator name" },
      { status: 400 },
    )
  }

  const creator = {
    name: data.name,
    email:
      data.email && typeof data.email === "string" ? data.email : undefined,
    phone:
      data.phone && typeof data.phone === "string" ? data.phone : undefined,
    website:
      data.website && typeof data.website === "string"
        ? data.website
        : undefined,
    youtube:
      data.youtube && typeof data.youtube === "string"
        ? data.youtube
        : undefined,
    twitter:
      data.twitter && typeof data.twitter === "string"
        ? data.twitter
        : undefined,
    instagram:
      data.instagram && typeof data.instagram === "string"
        ? data.instagram
        : undefined,
    facebook:
      data.facebook && typeof data.facebook === "string"
        ? data.facebook
        : undefined,
    twitch:
      data.twitch && typeof data.twitch === "string"
        ? data.twitch
        : undefined,
    contentType:
      data.contentType && typeof data.contentType === "string"
        ? data.contentType
        : undefined,
    description:
      data.description && typeof data.description === "string"
        ? data.description
        : undefined,
  }

  const result = await saveContentCreator(creator)

  if (result === "unconfigured") {
    return NextResponse.json(
      { error: "Database is not configured on the server." },
      { status: 503 },
    )
  }

  if (result === "invalid") {
    return NextResponse.json(
      { error: "Invalid content creator data" },
      { status: 400 },
    )
  }

  return NextResponse.json({ ok: true })
}
