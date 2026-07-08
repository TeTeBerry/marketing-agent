# marketing-agent

Raven internal marketing automation and **Content Engine** console.

## Daily CLI workflow

```bash
cd marketing-agent
cp .env.example .env   # BACKEND_INTERNAL_API_URL + INTERNAL_API_KEY
npm run daily
```

## Content Engine UI

Four-step wizard: Festival → Content Series → Platforms → Generate.

```bash
cd marketing-agent
npm run console:dev
```

Open http://localhost:5174 — uses the same `.env` as the CLI (`BACKEND_INTERNAL_API_URL`, `INTERNAL_API_KEY`).

## Architecture

```
Festival → Content Series → Platform(s) → AI Generation → Output
```

Series-first generation is backed by `POST /api/internal/marketing-ai/generate-content`. The legacy `generate-platform-content` endpoint remains for daily automation compatibility.

