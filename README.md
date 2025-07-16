# DylGPT

A ChatGPT-styled chat application that sends all messages via SMS using Twilio.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Twilio credentials:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_NUMBER=your_twilio_phone_number
RECIPIENT_NUMBER=recipient_phone_number
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Vercel

The easiest way to deploy is using the Vercel Platform:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project to Vercel:
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Configure environment variables during setup

3. Set environment variables in Vercel:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_NUMBER`
   - `RECIPIENT_NUMBER`

Alternatively, deploy using Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Features

- ChatGPT-like interface
- All messages are sent to the configured phone number via SMS
- Real-time message status updates
- Responsive design
- Dark mode support
# dylgpt
