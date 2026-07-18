/**
 * Application-wide constants
 */

/**
 * TIMEZONE CONFIGURATION
 *
 * The database stores all tournament dates in German time (CET/CEST).
 * CET = Central European Time (UTC+1) - Winter
 * CEST = Central European Summer Time (UTC+2) - Summer
 *
 * This constant ensures consistent timezone handling across the application.
 */
export const TOURNAMENT_TIMEZONE = "Europe/Berlin" as const

/**
 * Timezone offset helpers
 */
export const TIMEZONE_CONFIG = {
  /**
   * The primary timezone used for all tournament dates
   */
  timezone: TOURNAMENT_TIMEZONE,

  /**
   * Display name for user-facing messages
   */
  displayName: "German Time (CET/CEST)",

  /**
   * ISO 8601 format for database storage
   */
  isoFormat: "YYYY-MM-DDTHH:mm:ss",
} as const
