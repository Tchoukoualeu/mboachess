import { ObjectId } from "mongodb"
import { fetchPlayerSnapshot } from "./chesscom"
import { getDb, isMongoConfigured } from "./mongodb"
import { normalizeChesscomUsername } from "./chesscomUsernames"
import {
  getCompetitionStatus,
  sortParticipantsByStanding,
  type RatingSpeedRunCompetition,
  type RatingSpeedRunParticipant,
  type RatingType,
} from "./ratingSpeedRunShared"

const COMPETITIONS_COLLECTION = "rating_speed_runs"

type RatingSpeedRunDoc = Omit<RatingSpeedRunCompetition, "_id" | "id"> & {
  _id: ObjectId
}

export type CreateRatingSpeedRunInput = {
  title?: string
  description?: string
  prize?: string
  ratingType: RatingType
}

export type JoinRatingSpeedRunInput = {
  competitionId: string
  username: string
}

export type CreateRatingSpeedRunResult =
  | { ok: true; competitionId: string }
  | { ok: false; error: string; status?: number }

export type JoinRatingSpeedRunResult =
  { ok: true; already: boolean } | { ok: false; error: string; status?: number }

function toCompetition(doc: RatingSpeedRunDoc): RatingSpeedRunCompetition {
  return {
    ...doc,
    _id: String(doc._id),
    id: String(doc._id),
  }
}

function getStartDateFromCreatedAt(createdAt: Date): Date {
  return new Date(createdAt.getTime() + 24 * 60 * 60 * 1000)
}

function getEndDateFromStartDate(startDate: Date): Date {
  return new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
}

function getRatingValue(
  ratingType: RatingType,
  snapshot: Awaited<ReturnType<typeof fetchPlayerSnapshot>>,
): number | null {
  return snapshot[ratingType]
}

function isOlderThanThreeMonths(
  chessJoinedSeconds: number | null,
  startDate: Date,
): boolean {
  if (chessJoinedSeconds == null) return false
  const joinedAt = new Date(chessJoinedSeconds * 1000)
  const threshold = new Date(startDate)
  threshold.setMonth(threshold.getMonth() - 3)
  return joinedAt <= threshold
}

async function getCompetitionCollection() {
  if (!isMongoConfigured()) return null
  const db = await getDb()
  if (!db) return null
  return db.collection<RatingSpeedRunDoc>(COMPETITIONS_COLLECTION)
}

export async function createRatingSpeedRun(
  input: CreateRatingSpeedRunInput,
): Promise<CreateRatingSpeedRunResult> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      error: "Database is not configured on the server.",
      status: 503,
    }
  }

  const createdAt = new Date()
  const startDate = getStartDateFromCreatedAt(createdAt)
  const endDate = getEndDateFromStartDate(startDate)

  const col = await getCompetitionCollection()
  if (!col) {
    return {
      ok: false,
      error: "Database is not configured on the server.",
      status: 503,
    }
  }

  const result = await col.insertOne({
    _id: new ObjectId(),
    title: input.title?.trim() || "Rating speed run",
    description: input.description?.trim() || undefined,
    prize: input.prize?.trim() || undefined,
    ratingType: input.ratingType,
    createdAt,
    registrationOpenedAt: createdAt,
    registrationClosesAt: startDate,
    startDate,
    endDate,
    participants: [],
  })

  return { ok: true, competitionId: String(result.insertedId) }
}

export async function joinRatingSpeedRun(
  input: JoinRatingSpeedRunInput,
): Promise<JoinRatingSpeedRunResult> {
  const username = normalizeChesscomUsername(input.username)
  if (!username) {
    return {
      ok: false,
      error:
        "Invalid username (use 1–50 letters, numbers, underscore, or hyphen only).",
      status: 400,
    }
  }

  const col = await getCompetitionCollection()
  if (!col) {
    return {
      ok: false,
      error: "Database is not configured on the server.",
      status: 503,
    }
  }

  let competitionObjectId: ObjectId
  try {
    competitionObjectId = new ObjectId(input.competitionId)
  } catch {
    return { ok: false, error: "Competition not found.", status: 404 }
  }

  const competition = await col.findOne({ _id: competitionObjectId })
  if (!competition) {
    return { ok: false, error: "Competition not found.", status: 404 }
  }

  const normalizedCompetition = toCompetition(competition)
  if (new Date() >= normalizedCompetition.registrationClosesAt) {
    return {
      ok: false,
      error: "Registration is closed for this competition.",
      status: 400,
    }
  }

  if (
    normalizedCompetition.participants.some(
      (participant) => participant.username === username,
    )
  ) {
    return { ok: true, already: true }
  }

  const snapshot = await fetchPlayerSnapshot(username)
  if (snapshot.error && /not found/i.test(snapshot.error)) {
    return { ok: false, error: "Chess.com profile not found.", status: 404 }
  }

  const eligible = isOlderThanThreeMonths(
    snapshot.joined,
    normalizedCompetition.startDate,
  )
  if (!eligible) {
    return {
      ok: false,
      error:
        "Chess.com account must be at least 3 months old at competition start.",
      status: 400,
    }
  }

  const participant: RatingSpeedRunParticipant = {
    username: snapshot.username.toLowerCase(),
    joinedAt: new Date(),
    chessJoinedAt: snapshot.joined ? new Date(snapshot.joined * 1000) : null,
    eligible: true,
    startRating: null,
    currentRating: null,
    gainedPoints: 0,
    lostPoints: 0,
    netPoints: 0,
    lastSyncedAt: null,
    avatarUrl: snapshot.avatarUrl,
    countryCode: snapshot.countryCode,
    error: snapshot.error,
  }

  const result = await col.updateOne(
    {
      _id: competitionObjectId,
      "participants.username": { $ne: participant.username },
    },
    { $push: { participants: participant } },
  )

  if (result.modifiedCount === 0) {
    return { ok: true, already: true }
  }

  return { ok: true, already: false }
}

function sortParticipants(
  participants: RatingSpeedRunParticipant[],
): RatingSpeedRunParticipant[] {
  return sortParticipantsByStanding(participants)
}

async function syncCompetitionRatings(
  competition: RatingSpeedRunCompetition,
): Promise<RatingSpeedRunCompetition> {
  const status = getCompetitionStatus(competition)
  if (status === "registration-open" || competition.participants.length === 0) {
    return {
      ...competition,
      participants: sortParticipants(competition.participants),
    }
  }

  // Finished competitions with complete scores stay frozen — only re-rank.
  if (
    status === "finished" &&
    competition.participants.every(
      (participant) =>
        participant.startRating != null && participant.currentRating != null,
    )
  ) {
    const rankedParticipants = sortParticipants(competition.participants)
    const col = await getCompetitionCollection()
    if (col) {
      await col.updateOne(
        { _id: new ObjectId(competition.id) },
        { $set: { participants: rankedParticipants } },
      )
    }
    return { ...competition, participants: rankedParticipants }
  }

  const col = await getCompetitionCollection()
  if (!col)
    return {
      ...competition,
      participants: sortParticipants(competition.participants),
    }

  const now = new Date()
  const isRunning = status === "running"
  const isFinished = status === "finished"

  const syncedParticipants = await Promise.all(
    competition.participants.map(async (participant) => {
      const snapshot = await fetchPlayerSnapshot(participant.username)
      const rating = getRatingValue(competition.ratingType, snapshot)

      let startRating = participant.startRating
      let currentRating = participant.currentRating

      if (isRunning) {
        // Lock the baseline on first sync after the competition starts.
        if (startRating == null) startRating = rating
        currentRating = rating
      } else if (isFinished) {
        // Never invent a start rating after the run ends — that would force net 0.
        // Only fill a missing final rating when we already have a baseline.
        if (startRating != null && currentRating == null) {
          currentRating = rating
        }
      }

      const baseline = startRating ?? 0
      const latest = currentRating ?? baseline
      const delta =
        startRating == null || currentRating == null ? 0 : latest - baseline

      return {
        ...participant,
        eligible: participant.eligible,
        avatarUrl: snapshot.avatarUrl ?? participant.avatarUrl,
        countryCode: snapshot.countryCode ?? participant.countryCode,
        error: snapshot.error,
        startRating,
        currentRating,
        gainedPoints: delta > 0 ? delta : 0,
        lostPoints: delta < 0 ? Math.abs(delta) : 0,
        netPoints: delta,
        lastSyncedAt: now,
      }
    }),
  )

  const rankedParticipants = sortParticipants(syncedParticipants)

  await col.updateOne(
    { _id: new ObjectId(competition.id) },
    { $set: { participants: rankedParticipants } },
  )

  return { ...competition, participants: rankedParticipants }
}

export async function getRatingSpeedRuns(): Promise<
  RatingSpeedRunCompetition[]
> {
  const col = await getCompetitionCollection()
  if (!col) return []

  const docs = await col.find({}).sort({ createdAt: -1 }).toArray()
  return docs.map((doc) => {
    const competition = toCompetition(doc)
    return {
      ...competition,
      participants: sortParticipants(competition.participants),
    }
  })
}

export async function getRatingSpeedRunById(
  id: string,
): Promise<RatingSpeedRunCompetition | null> {
  const col = await getCompetitionCollection()
  if (!col) return null

  let objectId: ObjectId
  try {
    objectId = new ObjectId(id)
  } catch {
    return null
  }

  const doc = await col.findOne({ _id: objectId })
  if (!doc) return null

  return syncCompetitionRatings(toCompetition(doc))
}

export async function getLatestRatingSpeedRun(): Promise<RatingSpeedRunCompetition | null> {
  const competitions = await getRatingSpeedRuns()
  if (competitions.length === 0) return null
  return syncCompetitionRatings(competitions[0])
}
