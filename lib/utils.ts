import { TOURNAMENT_TIMEZONE } from "./constants"

/**
 * Formats a date for display in a specific timezone.
 * Database stores all tournament dates in German timezone.
 *
 * @param date - The date to format
 * @param timezone - IANA timezone string (defaults to German time for backwards compatibility)
 * @returns Formatted date string in the specified timezone
 *
 * @example
 * // Display in German time (default)
 * formatDate(new Date("2026-05-31T09:00:00Z"))
 * // Returns: "Sat, May 31, 2026, 11:00"
 *
 * @example
 * // Display in user's timezone
 * formatDate(new Date("2026-05-31T09:00:00Z"), "Africa/Douala")
 * // Returns: "Sat, May 31, 2026, 10:00" (UTC+1)
 */
export function formatDate(date: Date, timezone?: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone || TOURNAMENT_TIMEZONE, // User's timezone or German time
    hour12: false,
  })
}

/**
 * Formats a date in the user's local timezone.
 * Convenience wrapper around formatDate for displaying dates to users.
 *
 * @param date - The date to format
 * @param userTimezone - User's IANA timezone string
 * @returns Formatted date string in user's timezone
 */
export function formatDateInUserTimezone(
  date: Date,
  userTimezone: string,
): string {
  return formatDate(date, userTimezone)
}

/**
 * Formats a date in German time (for reference/comparison).
 *
 * @param date - The date to format
 * @returns Formatted date string in German timezone
 */
export function formatDateInGermanTime(date: Date): string {
  return formatDate(date, TOURNAMENT_TIMEZONE)
}

/**
 * Converts a datetime-local input string from user's timezone to UTC.
 * Database stores all dates in UTC for consistent timezone handling.
 *
 * @param datetimeLocal - String from datetime-local input (e.g., "2026-05-31T18:00")
 * @param userTimezone - IANA timezone string of user's location (e.g., "Africa/Douala")
 * @returns Date object in UTC representing that moment in time
 *
 * @example
 * // User in Cameroon (UTC+1) enters 18:00
 * datetimeLocalToUTC("2026-05-31T18:00", "Africa/Douala")
 * // Returns: Date object for 2026-05-31T17:00:00.000Z (17:00 UTC)
 *
 * @example
 * // User in German timezone (CEST = UTC+2 in summer) enters 18:00
 * datetimeLocalToUTC("2026-07-18T18:00", "Europe/Berlin")
 * // Returns: Date object for 2026-07-18T16:00:00.000Z (16:00 UTC)
 */
export function datetimeLocalToUTC(
  datetimeLocal: string,
  userTimezone: string,
): Date {
  // datetime-local format: "YYYY-MM-DDTHH:mm"
  const [datePart, timePart] = datetimeLocal.split("T")
  const [year, month, day] = datePart.split("-").map(Number)
  const [hour, minute] = timePart.split(":").map(Number)

  // Get the timezone offset for the user's timezone at this specific date/time
  const userLocalOffset = getTimezoneOffset(
    userTimezone,
    year,
    month - 1,
    day,
    hour,
    minute,
  )

  // Convert user's local time to UTC
  // Date.UTC creates a timestamp, then we subtract the offset to get actual UTC
  const utcTime = Date.UTC(year, month - 1, day, hour, minute) - userLocalOffset

  return new Date(utcTime)
}

/**
 * Legacy function name for backwards compatibility.
 * @deprecated Use datetimeLocalToUTC instead
 */
export function datetimeLocalToGermanTime(
  datetimeLocal: string,
  userTimezone?: string,
): Date {
  // If no timezone provided, assume user is in German timezone
  return datetimeLocalToUTC(datetimeLocal, userTimezone || TOURNAMENT_TIMEZONE)
}

/**
 * Gets the timezone offset in milliseconds for a given timezone at a specific date.
 * Handles daylight saving time (CET vs CEST) automatically.
 *
 * @param timezone - IANA timezone string (e.g., "Europe/Berlin")
 * @param year - Year
 * @param month - Month (0-11)
 * @param day - Day of month
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @returns Offset in milliseconds
 */
function getTimezoneOffset(
  timezone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): number {
  // Create a date in UTC
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute))

  // Format the date in the target timezone
  const tzDateString = utcDate.toLocaleString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  // Parse the formatted string back to a date
  const [datePart2, timePart2] = tzDateString.split(", ")
  const [m, d, y] = datePart2.split("/").map(Number)
  const [h, min] = timePart2.split(":").map(Number)

  const tzDate = new Date(y, m - 1, d, h, min)

  // The difference is the timezone offset
  return utcDate.getTime() - tzDate.getTime()
}

/**
 * Formats a date for datetime-local input field.
 * Converts from stored German time to the format expected by the input.
 *
 * @param date - Date object (in German timezone)
 * @returns String in format "YYYY-MM-DDTHH:mm"
 */
export function toDatetimeLocal(date: Date): string {
  // Format the date in German timezone
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOURNAMENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((p) => p.type === "year")?.value
  const month = parts.find((p) => p.type === "month")?.value
  const day = parts.find((p) => p.type === "day")?.value
  const hour = parts.find((p) => p.type === "hour")?.value
  const minute = parts.find((p) => p.type === "minute")?.value

  return `${year}-${month}-${day}T${hour}:${minute}`
}

/**
 * Gets the user's browser timezone using Intl API.
 * This function should be called client-side only.
 *
 * @returns IANA timezone string (e.g., "Africa/Douala", "Europe/Berlin")
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    // Fallback to UTC if timezone detection fails
    return "UTC"
  }
}

/**
 * Gets a human-readable name for a timezone.
 *
 * @param timezone - IANA timezone string
 * @returns Human-readable timezone name (e.g., "West Africa Standard Time")
 */
export function getTimezoneName(timezone: string): string {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "long",
    })
    const parts = formatter.formatToParts(now)
    const timeZoneName = parts.find((p) => p.type === "timeZoneName")?.value
    return timeZoneName || timezone
  } catch {
    return timezone
  }
}

/**
 * Converts a datetime-local string from user's timezone to German timezone for preview.
 *
 * @param datetimeLocal - String from datetime-local input
 * @param userTimezone - User's IANA timezone string
 * @returns Formatted string showing the German time equivalent
 */
export function previewGermanTime(
  datetimeLocal: string,
  userTimezone: string,
): string | null {
  if (!datetimeLocal) return null

  try {
    const germanDate = datetimeLocalToGermanTime(datetimeLocal, userTimezone)
    return formatDate(germanDate)
  } catch {
    return null
  }
}
