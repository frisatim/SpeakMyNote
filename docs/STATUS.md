# STATUS.md — done, verified, limitations, next step

Updated: 2026-09-15 (milestone 0). Every milestone updates this file.

Verification vocabulary used below:

- **mock check** — fixtures or mock providers, no paid API call.
- **live API check** — real provider call with real keys.
- **device check** — performed on a physical Android phone or iPhone.
- **not performed** — explicitly not done; never claimed.

## Current state

**Milestone 0 — scoping: done.** The repository contains documentation only.
No application code, no dependencies, no CI yet.

Files created: `AGENTS.md`, `README.md`, `.gitignore`, `docs/BUILD_PLAN.md`
(the plan, verbatim), `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`,
`docs/DATA_MODEL.md`, `docs/DECISIONS.md`, `docs/STATUS.md`.

Checks performed: documents cross-read against `docs/BUILD_PLAN.md` for scope,
stack, data model and exclusions. No code checks apply.

Not performed: nothing requires keys or phones at this stage.

## Backlog (numbered to match the prompts in `docs/BUILD_PLAN.md` §12)

| # | Milestone | Done when | Status |
| --- | --- | --- | --- |
| 0 | Scoping and repository state | Documentation and exclusions are coherent | **done** |
| 1 | Executable foundation: npm workspaces, Expo app, Fastify API with `/health`, config validation, structured errors, shared Zod language schemas, explicit mock mode, `.env.example`, lint/typecheck/test scripts, basic CI, Windows-friendly startup docs | Mock demo starts and `/health` responds | todo |
| 2 | Screens and local database: all seven screens with fixture data, versioned `expo-sqlite` migrations and repositories, demo lesson per language, manual lesson create/edit, active item selection (10 words, 2 patterns), language switching, immutable lesson snapshots | A lesson is created, edited and found again after relaunch | todo |
| 3 | Photo and real extraction: camera/gallery, preview, orientation, bounded compression, `/v1/lessons/extract` with Gemini vision adapter, editable draft with confirmation, error paths with fixtures | One photo per language yields a correctable lesson | todo |
| 4 | Text tutoring: `generateTutorTurn` adapter, `/v1/tutor/turn`, server-owned prompts, Repeat / Show meaning / Help me answer, assisted marking, persisted messages with IDs and sequence, one turn at a time, stale-response protection | Five natural turns grounded in the notes | todo |
| 5 | Voice: `expo-audio` recording, 60 s cap, `expo-speech` TTS, explicit audio states, OpenAI transcription adapter, transcript Send/Edit/Try again, Test voice, temp-file cleanup, permission/interruption/background handling | Five voice turns on Android and iPhone | todo |
| 6 | Memory and reliable evaluation: `evaluateSession` adapter, bounded evaluation route, `pending_jobs` with resume, observation validation, transactional idempotent application, progress recomputation, invalidation after edits, focused tests | Evaluation applied exactly once and found again | todo |
| 7 | Private beta preparation: one-use expiring codes, rate limits, revocable tokens in SecureStore, server-side hashes and quotas, request limits, global budget guard, technical-only logging, temp cleanup, versioned JSON export/replacement import, local deletion | Beta is protected and data is restorable | todo |
| 8 | Review and release preparation: audit against the plan, small zh/ko/fr evaluation set, `docs/TESTING.md`, release-blocker list, two-person device test plan | Two friends can install without a dev environment (with 9) | todo |
| 9 | Hosting and installable builds: API Dockerfile and single-instance persistent volume, EAS profiles (dev client, Android preview APK, iOS TestFlight), `docs/RELEASE.md` | Both testers install a real build using the hosted API | todo |
| 10 | Download page, after the beta: static English landing page with real APK / TestFlight links or an honest unavailable state | Both links lead to a real installation | todo |

Between milestones 3, 5, 6 and 7 the plan's **review prompt** is run and any
confirmed findings are fixed with the **fix prompt** before merging.

## Known limitations at this stage

- No code exists; every "done when" criterion above is unverified.
- Exact Gemini and OpenAI model IDs are not chosen yet. They will be selected
  at milestone 3 (vision), 4 (tutor) and 5 (STT) from what Tim's accounts
  actually expose, and recorded here and in `docs/DECISIONS.md`.
- TTS locales `zh-CN`, `ko-KR`, `fr-FR` are starting assumptions until checked
  on phones.

## Checks that will require a physical phone (running list)

- Photo capture, orientation and compression on Android and iPhone (m3).
- Microphone permission, recording, interruption and backgrounding (m5).
- System voice availability per language; iPhone silent-mode behaviour (m5).
- Relaunch persistence of lessons and progress (m2, m6).
- Phone reaching the local API over LAN or tunnel (m1).
- Standalone APK and TestFlight installation without Metro (m9).

## Next milestone

**Milestone 1 — executable foundation.** Use "Prompt 1" from
`docs/BUILD_PLAN.md` §12 on a new branch `milestone-1-foundation`.
