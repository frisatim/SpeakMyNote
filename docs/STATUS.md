# STATUS.md — done, verified, limitations, next step

Updated: 2026-09-15 (milestone 1). Every milestone updates this file.

Verification vocabulary used below:

- **mock check** — fixtures or mock providers, no paid API call.
- **live API check** — real provider call with real keys.
- **device check** — performed on a physical Android phone or iPhone.
- **not performed** — explicitly not done; never claimed.

## Current state

**Milestone 1 — executable foundation: done (mock checks only).**

### Changed behaviour

- npm workspaces monorepo with one lockfile: `apps/mobile`, `apps/api`,
  `packages/contracts`. Root scripts: `typecheck`, `lint`, `test`, `check`,
  `api`, `mobile`. Node 24 LTS (`.nvmrc`), TypeScript strict everywhere.
- `packages/contracts`: Zod schemas for language codes (`zh`, `ko`, `fr`
  only), support language `en`, TTS locales, structured API error, `/health`
  response, and the V1 limits constants.
- `apps/api`: Fastify 5 server. `GET /health` returns status, version,
  provider mode and environment (no secrets). Every error, including 404 and
  malformed JSON, follows `{ code, message, retryable, request_id }`;
  `x-request-id` is echoed or generated. Startup validates the environment
  with Zod: mock mode needs no keys; live mode requires `GEMINI_API_KEY`,
  `VISION_MODEL`, `TUTOR_MODEL`, `EVALUATOR_MODEL`, `OPENAI_API_KEY`,
  `STT_MODEL`; production refuses mock mode unless
  `ALLOW_MOCK_PROVIDERS_IN_PRODUCTION=true`. Provider interfaces
  (`extractLesson`, `generateTutorTurn`, `evaluateSession`, `transcribeAudio`)
  exist with labelled mock implementations; live adapters return a structured
  `PROVIDER_NOT_IMPLEMENTED` error until milestones 3–6.
- `apps/mobile`: Expo SDK 57 + Expo Router, one home screen that shows the
  supported languages, the configured `EXPO_PUBLIC_API_URL` and the live
  result of `/health` (Connected / Not reachable with the structured error).
- `.env.example` in both apps, `.gitignore` rules for `.env`, native folders,
  exports and databases, root ESLint flat config, GitHub Actions CI
  (typecheck, lint, test, API health smoke in mock mode, Android bundle).
- `docs/DEVELOPMENT.md`: Windows-friendly startup commands and how a physical
  phone reaches the local API (LAN IP, firewall, WSL2, emulator, tunnel).

### Checks performed (2026-09-15, WSL2, Node 24.21.0, npm 11.19.0)

| Check | Kind | Result |
| --- | --- | --- |
| `npm run typecheck` (3 workspaces) | mock | pass |
| `npm run lint` | mock | pass |
| `npm test` — 11 API tests, 5 contracts tests | mock | pass |
| API start in mock mode, `GET /health` → 200 with `provider_mode: mock` | mock | pass |
| `GET /nope` → 404 `NOT_FOUND`; malformed JSON → 400 `VALIDATION_ERROR` | mock | pass |
| `NODE_ENV=production PROVIDER_MODE=mock` → refuses to start, exit 1 | mock | pass |
| `PROVIDER_MODE=live` without keys → lists missing variables, exit 1 | mock | pass |
| `expo export --platform android` bundles the app (3.3 MB Hermes bundle) | mock | pass |
| GitHub Actions workflow | not performed | runs on the first push of the PR |

### Not performed

- No live API check (no keys involved in this milestone).
- No device check: the app was bundled, not run on a phone or emulator.

## Backlog (numbered to match the prompts in `docs/BUILD_PLAN.md` §12)

| # | Milestone | Done when | Status |
| --- | --- | --- | --- |
| 0 | Scoping and repository state | Documentation and exclusions are coherent | **done** |
| 1 | Executable foundation: npm workspaces, Expo app, Fastify API with `/health`, config validation, structured errors, shared Zod language schemas, explicit mock mode, `.env.example`, lint/typecheck/test scripts, basic CI, Windows-friendly startup docs | Mock demo starts and `/health` responds | **done** (device run pending) |
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

- The app has one placeholder screen; the seven product screens arrive in
  milestone 2. No SQLite yet.
- Live provider adapters are stubs returning `PROVIDER_NOT_IMPLEMENTED`.
  Exact Gemini and OpenAI model IDs are chosen at milestones 3–5 from what
  Tim's accounts actually expose.
- The API has no production build step: it runs TypeScript through `tsx`.
  A compiled build and Dockerfile come with milestone 9.
- ESLint covers TypeScript rules only; Expo/React-specific lint rules are not
  configured yet.
- TTS locales `zh-CN`, `ko-KR`, `fr-FR` are starting assumptions until checked
  on phones.

## Checks that will require a physical phone (running list)

- Photo capture, orientation and compression on Android and iPhone (m3).
- Microphone permission, recording, interruption and backgrounding (m5).
- System voice availability per language; iPhone silent-mode behaviour (m5).
- Relaunch persistence of lessons and progress (m2, m6).
- Phone reaching the local API over LAN or tunnel, and the home screen showing **Connected** in Expo Go (m1, still pending).
- Standalone APK and TestFlight installation without Metro (m9).

## Next milestone

**Milestone 2 — screens and local database.** Use "Prompt 2" from
`docs/BUILD_PLAN.md` §12 on a new branch `milestone-2-screens-db`. Before
that, Tim runs the milestone 1 device check: `npm run api`, `npm run mobile`,
Expo Go on a phone with `EXPO_PUBLIC_API_URL` set to the PC's LAN address.
