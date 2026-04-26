# mboachess

A small [Next.js](https://nextjs.org) app that shows a table of **Chess.com** players: **blitz** and **rapid** ratings, **online** status (from recent activity on the public profile), and **last seen** time. Data is read from the [Chess.com Published-Data (Pub) API](https://support.chess.com/en/articles/9650547-what-is-the-pubapi-and-how-do-i-use-it) on each page load (no database).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

```bash
npm run lint
```

## Changing the player list

Edit the `TRACKED_USERNAMES` array in `app/page.tsx` (lowercase usernames, as used in Chess.com profile URLs).

## API route (optional)

`POST /api/players` accepts JSON in either form (max 40 usernames, rate-limited with a short delay between users):

- `{ "usernames": ["hikaru", "fabianocaruana"] }`
- `{ "text": "hikaru\nfabianocaruana" }` (one per line or comma-separated)

Response: `{ "results": [ { "username", "blitz", "rapid", "online", "lastOnline", "error?" }, ... ] }`.

## Online column

**Online** is `true` when the profile’s `last_online` timestamp is within the last 5 minutes. Chess.com does not expose a dedicated public “is online” field anymore; this matches the old API behavior as a rough signal.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4

## Deploy

The app is a standard Next.js deploy (e.g. [Vercel](https://vercel.com/docs) or any Node host). Set no special env vars for the public Chess.com API.
