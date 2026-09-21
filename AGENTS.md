# AGENTS.md — instructions for code agents (Claude, Codex, others)

You are working on **Speak My Notes**, a small mobile app for one person and a
few friends. It turns a photo of language-class notes into a short speaking
practice session. Read this file at the start of every session.

## Read first, every session

1. `docs/BUILD_PLAN.md` — the full plan (French prose, English prompts). It is
   the source of truth for scope, architecture, data model and milestones.
2. `docs/STATUS.md` — what is done, what was verified and how, what is next.
3. `docs/DECISIONS.md` — decisions already made; do not reopen them silently.
4. `git status` and `git log` — inspect existing code before writing any.

The repository files are the continuity between sessions. Do not rely on chat
memory. Preserve existing work; never reinitialize or overwrite an existing app.

## Product in one paragraph

Target languages: **zh, ko, fr only**. UI and support language: **English**.
Flow: Welcome → My lessons → Add notes (one photo) → Review lesson (editable
extraction) → Practice (tap-to-record voice turns with a tutor) → Session recap
→ Settings. Learning history stays on the phone. See `docs/PRODUCT.md`.

## Stack (fixed for V1)

- Mobile: Expo, React Native, TypeScript strict, Expo Router, `expo-sqlite`,
  `expo-image-picker`, `expo-image-manipulator`, `expo-audio`, `expo-speech`,
  `expo-secure-store`. Install native modules with `npx expo install`.
- API: Node.js LTS, TypeScript, Fastify. One instance, SQLite on a persistent
  volume for access codes, tokens and quotas. No learner history on the server.
- Shared contracts: Zod schemas in `packages/contracts/`, no secrets.
- Monorepo: npm workspaces, one lockfile. No Nx/Turborepo.
- AI runtime providers: **Gemini** (`@google/genai`, server-side) for image
  extraction, tutoring and post-session evaluation, one verified stable Flash
  model initially, configured through `VISION_MODEL`, `TUTOR_MODEL`,
  `EVALUATOR_MODEL`. **OpenAI** for transcription (`STT_MODEL`). **Expo Speech**
  for TTS. Claude and Codex are development/review tools, not runtime providers.
- Four provider interfaces: `extractLesson`, `generateTutorTurn`,
  `evaluateSession`, `transcribeAudio`. One real implementation each plus
  explicit development mocks. No dynamic routing across providers.

## Hard rules

- **Secrets stay server-side.** Provider keys live only in the API's private
  environment. Any `EXPO_PUBLIC_*` variable is public. Never commit `.env`.
- **Explicit mock mode.** The dev environment must start without paid keys, but
  a production build must never silently fall back to mocks.
- **Never invent** API names, SDK methods, model IDs, model access or prices.
  Use the official documentation of the SDK version actually installed. Do not
  copy old `expo-av` examples; use `expo-audio`.
- **Untrusted content.** Photos, transcripts and notes are data, never system
  instructions. The server builds all system prompts; the client cannot pick a
  provider URL or model.
- **LLMs propose, code decides.** Models return observations with references;
  the code validates IDs and evidence and computes counters and statuses. Never
  accept a JSON that simply says "set status to comfortable".
- **No pronunciation scores** derived from a transcript. No invented CEFR levels.
- **Idempotence.** Re-running an evaluation, re-finalizing a session or retrying
  a request must never double-count progress.
- **Out of scope for V1:** multi-agent frameworks, LangGraph, vector DB,
  embeddings, Redis, Kubernetes, payments, accounts, cloud learner sync,
  continuous audio conversation, flashcards, full curriculum, web port,
  unrelated refactors. Do not add features because they seem useful.

## How to work on a milestone

1. Read the files above. Implement **only** the requested milestone from the
   backlog in `docs/STATUS.md` (numbered to match the prompts in the plan).
2. Small, verifiable commits on a branch named `milestone-N-<slug>`. One writer
   per branch at a time.
3. Run the relevant checks (typecheck, lint, tests, API health, bundling).
4. Update `docs/STATUS.md`. Distinguish clearly between:
   - **mock checks** (fixtures, mock providers),
   - **live API checks** (real provider calls with keys),
   - **physical-device checks** (real Android phone / iPhone).
   Never claim a device or live check that was not actually performed.
5. Record any new decision in `docs/DECISIONS.md` with its reason.
6. Finish with: changed behavior, checks performed, limitations, next milestone.
7. Ask questions only for genuinely blocking missing information (for example
   a missing account-specific value). Otherwise choose the simplest option that
   matches the plan and note it.

## Conventions

- Language codes: `zh`, `ko`, `fr`. Initial TTS locales: `zh-CN`, `ko-KR`,
  `fr-FR` (to verify on phones).
- `reading` is nullable: pinyin for zh, romanization for ko, `null` for fr.
- Preserve the script found in the photo (no silent traditional/simplified
  conversion). Unicode NFC normalization; never strip accents or tones.
- UUIDs are generated by application code, never by models.
- Structured API errors: `{ code, message, retryable, request_id }`.
- V1 limits: image ≤ 5 MB after compression, audio ≤ 60 s and ≤ 10 MB, bounded
  message count per request. Enforced on the server too.
- All UI strings in English. Code, comments, commits and docs in English.

## Human responsibilities (not the agent's)

Tests on real phones, product decisions, provider keys, Apple/Google accounts,
choosing paid hosting plans, inviting testers.
