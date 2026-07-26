# DylGPT

A single Next.js 15 (App Router) + React 19 + TypeScript app. It's a ChatGPT-styled chat UI where each message the user sends is delivered as an SMS via Twilio (there is no LLM). Package manager is npm.

Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`) and setup is documented in `README.md`.

## Cursor Cloud specific instructions

- Single service: the Next.js app (UI + the `app/api/send-sms` route). Run it with `npm run dev` (Turbopack, http://localhost:3000). There is no database, cache, or other backing service.
- Twilio env vars are required for the SMS route and for `npm run build`:
  - `app/api/send-sms/route.ts` throws at module import if `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_NUMBER`, or `RECIPIENT_NUMBER` are missing.
  - `npm run dev` still starts without them (the route only throws when first invoked), but `npm run build` fails during "Collecting page data" without them. Put them in `.env.local` (gitignored).
  - `TWILIO_ACCOUNT_SID` must start with `AC` or the Twilio client constructor throws even before any request.
- Real, valid Twilio credentials are needed to actually deliver an SMS. With placeholder values the full code path still runs and fails only at the Twilio API call ("Authentication Error - invalid username"), which is enough to verify wiring but not delivery.
