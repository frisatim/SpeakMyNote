# Speak My Notes

**Turn today's lesson into a conversation.**

A small Expo (React Native) app for Android and iOS: photograph your
language-class notes, review the extracted lesson, then practise speaking with
a tutor for a few minutes. Learning history stays on the phone. Target
languages: Mandarin Chinese, Korean and French. UI in English.

Personal project first, then a small private beta with friends.

## Status

Milestone 1 (executable foundation): the API answers `/health` in mock mode
and the Expo app bundles. No product screens yet. See `docs/STATUS.md`.

## Quick start

```powershell
npm install                  # Node 24 LTS
copy apps\api\.env.example apps\api\.env
copy apps\mobile\.env.example apps\mobile\.env   # set EXPO_PUBLIC_API_URL to your PC's LAN IP
npm run api                  # terminal 1: Fastify on http://0.0.0.0:3000
npm run mobile               # terminal 2: Expo, scan the QR code with Expo Go
npm run check                # typecheck + lint + tests
```

Details, phone networking and WSL2 notes: `docs/DEVELOPMENT.md`.

## Documentation

| File | Content |
| --- | --- |
| `AGENTS.md` | Instructions for code agents |
| `docs/BUILD_PLAN.md` | Full plan and implementation prompts (source of truth) |
| `docs/PRODUCT.md` | Scope, screens and user journey |
| `docs/ARCHITECTURE.md` | Components, flows, providers, API contracts |
| `docs/DATA_MODEL.md` | Local tables, item identity, progress rules, idempotence |
| `docs/DECISIONS.md` | Decisions and their reasons |
| `docs/STATUS.md` | Done / verified / limitations / backlog / next step |
| `docs/DEVELOPMENT.md` | Install, run, check, phone networking |

## Layout

```
apps/mobile/         Expo app (Expo Router)
apps/api/            Fastify API and AI provider adapters
packages/contracts/  Shared Zod schemas and types
docs/                Documentation
```
