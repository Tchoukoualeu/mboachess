export type RatingType = "blitz" | "rapid" | "bullet"

export type RatingSpeedRunParticipant = {
  username: string
  joinedAt: Date
  chessJoinedAt: Date | null
  eligible: boolean
  ineligibleReason?: string
  startRating: number | null
  currentRating: number | null
  gainedPoints: number
  lostPoints: number
  netPoints: number
  lastSyncedAt: Date | null
  avatarUrl: string | null
  countryCode: string | null
  error?: string
}

export type RatingSpeedRunCompetition = {
  _id?: string
  id: string
  title: string
  description?: string
  prize?: string
  ratingType: RatingType
  createdAt: Date
  registrationOpenedAt: Date
  registrationClosesAt: Date
  startDate: Date
  endDate: Date
  participants: RatingSpeedRunParticipant[]
}

export type CompetitionStatus =
  "registration-open" | "upcoming" | "running" | "finished"

export function getCompetitionStatus(
  competition: Pick<
    RatingSpeedRunCompetition,
    "registrationClosesAt" | "startDate" | "endDate"
  >,
  now = new Date(),
): CompetitionStatus {
  if (now < competition.registrationClosesAt) return "registration-open"
  if (now < competition.startDate) return "upcoming"
  if (now <= competition.endDate) return "running"
  return "finished"
}
