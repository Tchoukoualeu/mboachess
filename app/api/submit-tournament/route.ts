import { NextResponse } from "next/server"
import { saveTournament } from "@/lib/tournaments"

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
      { error: "Missing tournament name" },
      { status: 400 },
    )
  }

  if (!data.startDate || typeof data.startDate !== "string") {
    return NextResponse.json({ error: "Missing start date" }, { status: 400 })
  }

  const startDate = new Date(data.startDate)
  if (isNaN(startDate.getTime())) {
    return NextResponse.json({ error: "Invalid start date" }, { status: 400 })
  }

  // Check if tournament is in the future
  if (startDate < new Date()) {
    return NextResponse.json(
      { error: "Tournament must start in the future" },
      { status: 400 },
    )
  }

  const tournament = {
    name: data.name,
    startDate,
    endDate:
      data.endDate && typeof data.endDate === "string"
        ? new Date(data.endDate)
        : undefined,
    location:
      data.location && typeof data.location === "string"
        ? data.location
        : undefined,
    description:
      data.description && typeof data.description === "string"
        ? data.description
        : undefined,
    link: data.link && typeof data.link === "string" ? data.link : undefined,
  }

  const result = await saveTournament(tournament)

  if (result === "unconfigured") {
    return NextResponse.json(
      { error: "Database is not configured on the server." },
      { status: 503 },
    )
  }

  if (result === "invalid") {
    return NextResponse.json(
      { error: "Invalid tournament data" },
      { status: 400 },
    )
  }

  return NextResponse.json({ ok: true })
}
