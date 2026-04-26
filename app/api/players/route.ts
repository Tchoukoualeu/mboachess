import { NextResponse } from "next/server";
import { fetchPlayerSnapshot, parseUsernamesList } from "@/lib/chesscom";

const MAX_USERNAMES = 40;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const list =
    typeof body === "object" &&
    body !== null &&
    "usernames" in body &&
    Array.isArray((body as { usernames: unknown }).usernames)
      ? (body as { usernames: string[] }).usernames
      : null;

  if (list) {
    const parsed = list
      .map((s) => (typeof s === "string" ? s.trim() : ""))
      .filter(Boolean) as string[];
    const fromArray = [
      ...new Set(parsed.map((s) => s.replace(/^@/, "").toLowerCase())),
    ].filter((s) => /^[a-z0-9_-]{1,50}$/i.test(s));
    if (fromArray.length > MAX_USERNAMES) {
      return NextResponse.json(
        { error: `At most ${MAX_USERNAMES} usernames` },
        { status: 400 }
      );
    }
    const results = [];
    for (const u of fromArray) {
      results.push(await fetchPlayerSnapshot(u));
      await new Promise((r) => setTimeout(r, 120));
    }
    return NextResponse.json({ results });
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "text" in body &&
    typeof (body as { text: unknown }).text === "string"
  ) {
    const usernames = parseUsernamesList((body as { text: string }).text);
    if (usernames.length === 0) {
      return NextResponse.json(
        { error: "No valid usernames" },
        { status: 400 }
      );
    }
    if (usernames.length > MAX_USERNAMES) {
      return NextResponse.json(
        { error: `At most ${MAX_USERNAMES} usernames` },
        { status: 400 }
      );
    }
    const results = [];
    for (const u of usernames) {
      results.push(await fetchPlayerSnapshot(u));
      await new Promise((r) => setTimeout(r, 120));
    }
    return NextResponse.json({ results });
  }

  return NextResponse.json(
    { error: "Expected { text: string } or { usernames: string[] }" },
    { status: 400 }
  );
}
