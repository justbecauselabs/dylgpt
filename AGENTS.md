# AGENTS.md

## Cursor Cloud specific instructions

DylGPT is a single Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 app. It mimics a ChatGPT UI but forwards every typed message as an SMS via Twilio. There is no database or other backing service. Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`).

- Run the dev server with `npm run dev` (Turbopack) on http://localhost:3000.
- The Twilio API route at `app/api/send-sms/route.ts` throws at module load if any of `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_NUMBER`, `RECIPIENT_NUMBER` are unset. A local `.env.local` (gitignored) with these four vars is required for the server/build to boot. Placeholder values let the UI and API flow run, but the actual SMS send returns Twilio error `20003` (HTTP 401) until real credentials are provided.
- Real, valid Twilio credentials (and a verified recipient number) are needed to demonstrate a successful SMS send end-to-end; without them the chat shows the in-app error message instead of "Your message has been sent via SMS!".
- The first visit shows a name-entry modal; the entered name is stored in the `dylgpt_user` cookie and prepended to outgoing SMS.
