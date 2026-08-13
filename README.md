# DylGPT

A focused AI chat app backed by xAI's Grok API. The API key stays on the server, and each request includes the current conversation so Grok can respond with context.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your xAI API key:

```env
XAI_API_KEY=your_xai_api_key
```

The app uses `grok-4-latest` by default. Set `XAI_MODEL` to use another model:

```env
XAI_MODEL=grok-4-latest
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Features

- Multi-turn conversations with Grok
- Server-only API credentials
- Configurable xAI model
- Clear API and configuration errors in the chat
- Responsive design
- Personalized welcome screen
