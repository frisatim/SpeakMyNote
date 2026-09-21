# Speak My Notes

**Turn today's lesson into a conversation.**

A small Expo (React Native) app for Android and iOS: photograph your
language-class notes, review the extracted lesson, then practise speaking with
a tutor for a few minutes. Learning history stays on the phone. Target
languages: Mandarin Chinese, Korean and French. UI in English.

Personal project first, then a small private beta with friends.

## Status

Milestone 0 (scoping). No application code yet. See `docs/STATUS.md`.

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

## Planned layout

```
apps/mobile/         Expo app
apps/api/            Fastify API and AI provider adapters
packages/contracts/  Shared Zod schemas and types
docs/                Documentation
```
