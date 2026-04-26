# mboachess

**mboachess** is a small, free tool for the chess community. The goal is to help **promote chess for all Cameroonian players**—and anyone who wants to follow friends or teammates on [Chess.com](https://www.chess.com/)—by surfacing public ratings and activity in one place.

The app is a [Next.js](https://nextjs.org) dashboard: a table of **blitz** and **rapid** ratings, **online**-style status (from recent public profile activity), and **last seen** time. It reads the [Chess.com Published-Data (Pub) API](https://support.chess.com/en/articles/9650547-what-is-the-pubapi-and-how-do-i-use-it) on each request; there is no database.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For production: `npm run build` then `npm start`. Run `npm run lint` before submitting changes.

## Changing the player list

Edit the `TRACKED_USERNAMES` array in `app/page.tsx` (lowercase usernames, as used in Chess.com profile URLs). Chess.com client logic for fetching a player lives in `lib/chesscom.ts`.

## Online column

**Online** is `true` when the profile’s `last_online` timestamp is within the last 5 minutes. Chess.com does not expose a dedicated public “is online” field anymore; this is a simple proxy.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4

## Deploy

Standard Next.js deploy (e.g. [Vercel](https://vercel.com/docs) or any Node host). No special env vars are required for the public Chess.com API.

## Contributing

Contributions are welcome. Open an issue to discuss ideas, or send a pull request with clear commits and a short description of the change. Please keep the scope focused; match existing code style. Bug fixes, documentation, and small features that help Cameroonian (and all) players follow chess online are especially appreciated.

## License

This project is released under the [MIT License](LICENSE).
