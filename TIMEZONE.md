# Timezone Handling Documentation

## Overview

All tournament dates in this application are **stored in UTC** and **displayed in the user's local timezone** (with German time as a reference).

- **Storage**: UTC (Coordinated Universal Time) - industry standard for timezone-agnostic storage
- **Display**: User's local timezone (auto-detected) + German time reference
- **Reference**: German time (CET/CEST) - since FECADE uses European time standards

**German Time:**

- **CET** = Central European Time (UTC+1) - Winter time
- **CEST** = Central European Summer Time (UTC+2) - Summer time (DST)

## Why UTC Storage?

Storing dates in UTC ensures:

1. **Consistency**: No ambiguity across different server/client timezones
2. **Flexibility**: Easy to display in any timezone
3. **Accuracy**: Proper handling of daylight saving time transitions
4. **Best Practice**: Industry standard for web applications

German time is shown as a reference since FECADE (the organizing federation) follows European time standards.

## Implementation Details

### 1. Constants (`lib/constants.ts`)

The timezone is centrally configured:

```typescript
export const TOURNAMENT_TIMEZONE = "Europe/Berlin" as const
```

This IANA timezone identifier:

- Automatically handles daylight saving time transitions
- Works with JavaScript `Intl.DateTimeFormat` API
- Ensures consistency across the entire application

### 2. Date Storage

#### Database

MongoDB stores all dates as BSON Date objects in **UTC** (internally uses milliseconds since Unix epoch).

**Important**: The database stores UTC timestamps. When you see `2026-05-31T07:00:00.000Z` in the database, this represents:

- 7:00 AM UTC
- 9:00 AM CEST (German summer time, UTC+2)
- 8:00 AM WAT (West Africa Time, UTC+1)

#### Seed Data (`lib/tournaments.ts`)

All seed tournament dates use the `germanDate()` helper function to convert German time to UTC:

```typescript
startDate: germanDate("2026-05-31T09:00:00")
// Input: 9:00 AM German time (May = CEST = UTC+2)
// Stored: 2026-05-31T07:00:00.000Z (7:00 AM UTC)
```

This ensures the time "09:00:00" is interpreted as 9:00 AM German time and properly converted to UTC for storage.

### 3. Date Display (`lib/utils.ts`)

Tournament times are **displayed in the user's local timezone** for better UX, with German time shown as a reference.

#### `formatDate(date: Date, timezone?: string): string`

Formats dates for display in any timezone (defaults to German time for backwards compatibility):

```typescript
export function formatDate(date: Date, timezone?: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    // ... other options
    timeZone: timezone || TOURNAMENT_TIMEZONE, // User's timezone or German time
  })
}
```

**Examples:**

```typescript
// User in Cameroon (UTC+1)
formatDate(new Date("2026-05-31T08:00:00Z"), "Africa/Douala")
// Returns: "Sat, May 31, 2026, 09:00" (9:00 AM WAT)

// Display in German time (default)
formatDate(new Date("2026-05-31T08:00:00Z"))
// Returns: "Sat, May 31, 2026, 10:00" (10:00 AM CEST, UTC+2 in summer)
```

#### Helper Functions

- `formatDateInUserTimezone(date, userTimezone)` - Formats in user's timezone
- `formatDateInGermanTime(date)` - Formats in German time (for reference)

### 4. Form Input (`components/AddTournamentForm.tsx`)

The HTML `<input type="datetime-local">` element captures user input without timezone information.

**User sees:** `2026-05-31 09:00` (in their local time)
**Browser sends:** `"2026-05-31T09:00"` (no timezone) + `userTimezone: "Africa/Douala"`

The form **automatically detects** the user's timezone using `Intl.DateTimeFormat().resolvedOptions().timeZone` and includes it in the submission.

The form displays:

- User's detected timezone
- Real-time preview showing what time it will be in German timezone
- Clear indication that they should enter times in their local time

**Example UI:**

```
Your timezone: West Africa Standard Time (Africa/Douala)
Enter times in your local time. They will be stored in UTC and displayed in your timezone when viewing.

Start Date * (Your Time): [2026-05-31 09:00]
→ German time: Sat, May 31, 2026, 10:00
```

The German time preview helps users understand how their local time compares to the reference timezone.

### 5. Date Conversion (`lib/utils.ts`)

#### `datetimeLocalToUTC(datetimeLocal: string, userTimezone: string): Date`

**Primary function** for converting form input from user's local timezone to UTC for storage:

```typescript
// User in Cameroon (Africa/Douala, UTC+1) enters: "2026-05-31T09:00" (9 AM their time)
const utcDate = datetimeLocalToUTC(
  "2026-05-31T09:00",
  "Africa/Douala",
)
// Returns: Date object representing 2026-05-31T08:00:00.000Z (8:00 AM UTC)
// Which is: 9:00 AM WAT (UTC+1) = 10:00 AM CEST (UTC+2) = 8:00 AM UTC
```

This function:

1. Parses the date/time components from the datetime-local string
2. Calculates the timezone offset for the user's timezone at that specific date/time
3. Converts the user's local time to UTC
4. Returns a UTC-based Date object for database storage

**How it handles DST:**
```typescript
// User in Germany enters time during summer (CEST = UTC+2)
datetimeLocalToUTC("2026-05-31T09:00", "Europe/Berlin")
// Returns: 2026-05-31T07:00:00.000Z (9:00 AM CEST - 2 hours = 7:00 AM UTC)

// Same user enters time during winter (CET = UTC+1)
datetimeLocalToUTC("2026-12-25T09:00", "Europe/Berlin")
// Returns: 2026-12-25T08:00:00.000Z (9:00 AM CET - 1 hour = 8:00 AM UTC)
```

#### `datetimeLocalToGermanTime(datetimeLocal: string, userTimezone?: string): Date` *(Deprecated)*

**Legacy wrapper** for backwards compatibility. Now calls `datetimeLocalToUTC()` internally:

```typescript
// Deprecated - use datetimeLocalToUTC instead
const date = datetimeLocalToGermanTime("2026-05-31T09:00", "Africa/Douala")
// Internally calls: datetimeLocalToUTC("2026-05-31T09:00", "Africa/Douala")
```

If `userTimezone` is not provided, defaults to `TOURNAMENT_TIMEZONE` (German time).

#### `getUserTimezone(): string`

Detects the user's browser timezone:

```typescript
const tz = getUserTimezone()
// Returns: "Africa/Douala", "Europe/Berlin", "America/New_York", etc.
```

#### `previewGermanTime(datetimeLocal: string, userTimezone: string): string | null`

Shows a preview of what the German time will be:

```typescript
const preview = previewGermanTime("2026-05-31T09:00", "Africa/Douala")
// Returns: "Sat, May 31, 2026, 10:00" (in summer)
```

### 6. API Handler (`src/app/api/submit-tournament.ts`)

The API receives the user's timezone and converts form inputs to UTC before saving to database:

```typescript
// Extract user's timezone from request (defaults to German time if not provided)
const userTimezone = data.userTimezone && typeof data.userTimezone === "string"
  ? data.userTimezone
  : TOURNAMENT_TIMEZONE

// Convert from user's local time to UTC for storage
const startDate = datetimeLocalToUTC(data.startDate, userTimezone)
```

**Backwards compatible:** If no `userTimezone` is provided, defaults to German timezone for conversion, maintaining legacy behavior.

## Flow Diagram

### Current: UTC Storage with User Timezone Display

```
User in Cameroon (UTC+1)
     ↓
Browser detects: "Africa/Douala"
     ↓
User enters: "2026-05-31T09:00" (9 AM Cameroon time)
     ↓
Live Preview: "→ German time: Sat, May 31, 2026, 10:00" (CEST = UTC+2)
     ↓
Form submits: {
  startDate: "2026-05-31T09:00",
  userTimezone: "Africa/Douala"
}
     ↓
API: datetimeLocalToUTC("2026-05-31T09:00", "Africa/Douala")
     ↓
Date object: 2026-05-31T08:00:00.000Z (8:00 UTC)
     ↓
MongoDB (stores UTC: 2026-05-31T08:00:00.000Z)
     ↓
Retrieved as Date object (UTC timestamp)
     ↓
Display in user's timezone:
formatDate(date, "Africa/Douala") → "Sat, May 31, 2026, 09:00" (user's time)
formatDateInGermanTime(date) → "Sat, May 31, 2026, 10:00" (reference)
```

**Key Points:**
1. User enters time in their local timezone (9:00 AM Cameroon)
2. Converted to UTC for storage (8:00 AM UTC)
3. Can be displayed in any timezone:
   - User sees 9:00 AM (their input time)
   - German reference shows 10:00 AM (CEST)
   - Both are correct representations of the same UTC moment

### LEGACY: Without Timezone (backwards compatible)

```
User Input Form
     ↓
"2026-05-31T09:00" (datetime-local string, no timezone)
     ↓
datetimeLocalToUTC("2026-05-31T09:00", TOURNAMENT_TIMEZONE) // Defaults to German time
     ↓
Date object: 2026-05-31T07:00:00.000Z (9:00 German = 7:00 UTC in summer)
     ↓
MongoDB (stores UTC: 2026-05-31T07:00:00.000Z)
     ↓
Retrieved as Date object
     ↓
formatDate() → "Sat, May 31, 2026, 09:00" (displayed in German time by default)
```

## Daylight Saving Time (DST)

The implementation automatically handles DST transitions:

- **Last Sunday of March**: CET (UTC+1) → CEST (UTC+2)
- **Last Sunday of October**: CEST (UTC+2) → CET (UTC+1)

Example:

```typescript
// March 30, 2026 - Before DST (CET = UTC+1)
germanDate("2026-03-30T09:00:00") // 9:00 CET = 8:00 UTC

// March 31, 2026 - After DST (CEST = UTC+2)
germanDate("2026-03-31T09:00:00") // 9:00 CEST = 7:00 UTC
```

## Countdown Timers (`src/app/tournaments.$id.tsx`)

Countdown timers use JavaScript's native Date comparison:

```typescript
const now = new Date() // Current UTC time
const diff = tournament.startDate.getTime() - now.getTime()
```

This works correctly because:

1. `tournament.startDate` is a Date object storing a UTC timestamp
2. `new Date()` gets current UTC time
3. Both are compared at the UTC level (milliseconds since Unix epoch)
4. The time difference is accurate regardless of user's local timezone or DST
5. Display can be in any timezone while the countdown math remains correct

## Testing Timezone Correctness

To verify timezone handling is working:

1. **Check seed data**:

   ```typescript
   console.log(SEED_TOURNAMENTS[0].startDate.toISOString())
   // Should show UTC time offset by 1-2 hours from the input time
   ```

2. **Check display**:

   ```typescript
   formatDate(germanDate("2026-05-31T09:00:00"))
   // Should output: "Sat, May 31, 2026, 09:00"
   ```

3. **Check form conversion**:
   ```typescript
   const date = datetimeLocalToGermanTime("2026-05-31T09:00")
   console.log(date.toISOString())
   // May 2026 is CEST (UTC+2), so should be "2026-05-31T07:00:00.000Z"
   ```

## Common Pitfalls (Avoided)

❌ **DON'T**: Use `new Date("2026-05-31T09:00:00")` without timezone

- Different behavior in browser vs Node.js
- Ambiguous - could be local time, UTC, or anything

✅ **DO**: Use `germanDate("2026-05-31T09:00:00")`

- Explicit German timezone
- Consistent across all environments

---

❌ **DON'T**: Format with `timeZone: "UTC"`

- Shows wrong time to users

✅ **DO**: Format with `timeZone: TOURNAMENT_TIMEZONE`

- Shows correct German time

---

❌ **DON'T**: Send datetime-local input directly to DB

- Browser's local time would be saved instead of German time

✅ **DO**: Convert with `datetimeLocalToGermanTime()`

- Properly interprets input as German time

## User Experience

### Displaying Tournament Times

**Users see times in their local timezone**, making it easier to understand when tournaments start:

- **Tournament List** (`/tournaments`): Times shown in user's timezone
- **Tournament Detail** (`/tournaments/$id`): Times shown in user's timezone + German time reference
- **Countdown Timer**: Works correctly regardless of user's location (uses UTC comparison)

**Example for a user in Cameroon (UTC+1):**

```
Tournament starting at 10:00 AM German time (CEST = UTC+2)
→ User sees: "Sat, May 31, 2026, 09:00" (their local time)
→ Detail page also shows: "German time: Sat, May 31, 2026, 10:00"
```

### Adding Tournament Times

**Users enter times in their local timezone**, and the system automatically converts to German time:

```
User in Cameroon enters: 9:00 AM (their time)
→ Preview shows: "German time: 10:00 AM"
→ Saved as: 10:00 AM German time
```

## Summary

| Component     | File                               | Function                      | Purpose                            |
| ------------- | ---------------------------------- | ----------------------------- | ---------------------------------- |
| Constants     | `lib/constants.ts`                 | `TOURNAMENT_TIMEZONE`         | Central timezone config            |
| Parsing       | `lib/tournaments.ts`               | `germanDate()`                | Parse seed dates in German time    |
| Display       | `lib/utils.ts`                     | `formatDate()`                | Show dates in user/German timezone |
| User Display  | `lib/utils.ts`                     | `formatDateInUserTimezone()`  | Show dates in user's timezone      |
| German Ref    | `lib/utils.ts`                     | `formatDateInGermanTime()`    | Show German time reference         |
| Form Input    | `lib/utils.ts`                     | `datetimeLocalToGermanTime()` | Convert user time to German time   |
| Form Display  | `lib/utils.ts`                     | `toDatetimeLocal()`           | Convert Date to form format        |
| Timezone Util | `lib/utils.ts`                     | `getUserTimezone()`           | Detect user's browser timezone     |
| API           | `src/app/api/submit-tournament.ts` | Uses conversion utility       | Save correct timezone to DB        |
| List Page     | `src/app/tournaments.index.tsx`    | Uses user timezone            | Display times in user's local time |
| Detail Page   | `src/app/tournaments.$id.tsx`      | Uses user + German timezone   | Display both user and German time  |

## Future Considerations

If you need to support multiple timezones in the future:

1. Store user's preferred timezone in user profile
2. Keep database dates in German time (as source of truth)
3. Convert display times based on user preference
4. Keep the current system as the default

This maintains backward compatibility while adding flexibility.
