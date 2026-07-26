# AGENTS.md

## Cursor Cloud specific instructions

DylGPT is a single Next.js 15 (App Router) app — a ChatGPT-styled UI that sends each chat message as an SMS via Twilio. There is no separate backend/database; the only server code is the route handler `app/api/send-sms/route.ts`. Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`); the update script already runs `npm install`.

Non-obvious caveats:

- **Twilio env vars are required for `next build` and for the `/api/send-sms` route to load.** `app/api/send-sms/route.ts` throws at module import time if `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_NUMBER`, or `RECIPIENT_NUMBER` are unset. `npm run build` fails during "Collecting page data" without them. Create a `.env.local` (gitignored) with these four vars before building or calling the API. `TWILIO_ACCOUNT_SID` must start with `AC` or the Twilio client constructor throws — placeholder example: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.
- **`npm run dev` works without real/placeholder creds for the UI**, because the API route is compiled lazily on first request. The home page, name modal, and chat UI all render fine; only sending a message hits the route.
- **Actually delivering an SMS requires real Twilio credentials** (a paid external account). With placeholder/invalid creds, `POST /api/send-sms` returns HTTP 500 (`Authentication Error - invalid username`) and the UI shows "Sorry, there was an error sending your message." This is expected without real credentials — the rest of the app is fully functional.
- Dev server runs on `http://localhost:3000` and uses Turbopack (`next dev --turbopack`).
