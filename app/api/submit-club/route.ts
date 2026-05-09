import { NextResponse } from "next/server"
import { saveClub } from "@/lib/clubs"

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
    return NextResponse.json({ error: "Missing club name" }, { status: 400 })
  }

  const club = {
    name: data.name,
    location:
      data.location && typeof data.location === "string"
        ? data.location
        : undefined,
    description:
      data.description && typeof data.description === "string"
        ? data.description
        : undefined,
    contactName:
      data.contactName && typeof data.contactName === "string"
        ? data.contactName
        : undefined,
    email:
      data.email && typeof data.email === "string" ? data.email : undefined,
    phone:
      data.phone && typeof data.phone === "string" ? data.phone : undefined,
    website:
      data.website && typeof data.website === "string"
        ? data.website
        : undefined,
    meetingSchedule:
      data.meetingSchedule && typeof data.meetingSchedule === "string"
        ? data.meetingSchedule
        : undefined,
  }

  const result = await saveClub(club)

  if (result === "unconfigured") {
    return NextResponse.json(
      { error: "Database is not configured on the server." },
      { status: 503 },
    )
  }

  if (result === "invalid") {
    return NextResponse.json({ error: "Invalid club data" }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
