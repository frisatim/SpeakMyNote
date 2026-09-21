# DECISIONS.md — important decisions and their reasons

Append-only log. Newest at the bottom. Format: date, decision, reason,
consequences. Reopen a decision only with a new dated entry that supersedes it.

## D-001 — 2026-09-15 — Expo React Native + TypeScript for Android and iOS

**Decision.** One Expo (React Native, TypeScript strict, Expo Router) codebase.
**Reason.** Same code on both platforms; Tim develops on Windows and uses EAS
Build for iOS; Expo modules cover camera, SQLite, audio and TTS.
**Consequences.** Native modules installed via `npx expo install`; iOS local
builds/simulator need macOS, so validation happens on real phones.

## D-002 — 2026-09-15 — Local-first SQLite, no learner history on the server

**Decision.** All lessons, messages, events and progress stay in the phone's
SQLite. The server keeps only access/quota data.
**Reason.** Personal app, privacy, no account system, simpler backend.
**Consequences.** No sync; versioned JSON export/import is the only backup
(milestone 7). Uninstalling without export loses data; the UI must say so.
"Local-first" still requires Internet for extraction, transcription and new
tutor turns.

## D-003 — 2026-09-15 — Small Fastify API keeps all provider keys

**Decision.** A single-instance TypeScript Fastify API holds Gemini/OpenAI
keys, builds all system prompts, validates inputs and enforces quotas.
**Reason.** Keys must never ship in an APK; `EXPO_PUBLIC_*` is public.
**Consequences.** Every paid route requires a per-tester token. One instance
only while quotas live in SQLite; scaling out would require a shared store.

## D-004 — 2026-09-15 — Gemini Flash for extraction, tutoring and evaluation

**Decision.** One verified stable Gemini Flash model (vision + structured
output) for the three text/vision functions, via `@google/genai` server-side.
Model IDs configured separately as `VISION_MODEL`, `TUTOR_MODEL`,
`EVALUATOR_MODEL` and may be identical.
**Reason.** Tim's preference for simplicity and cost; one provider to learn.
**Consequences.** The exact model ID is picked at implementation time from
the models actually available in Tim's Google AI Studio project; never invent
one. Real cost is measured on real sessions; no claim that any Gemini variant
is cheaper than any Claude variant. Claude and Codex are dev/review tools only.

## D-005 — 2026-09-15 — OpenAI for transcription, Expo Speech for TTS

**Decision.** Speech-to-text through an OpenAI transcription model
(`STT_MODEL`, configurable) behind the API. Text-to-speech through system
voices with `expo-speech`.
**Reason.** Good multilingual STT with language hints; free local TTS is enough
for V1.
**Consequences.** Verify the configured model's parameters in the official
docs (models differ). Provide **Test voice** and a text fallback; document the
iOS silent-mode caveat. A clean transcript never proves pronunciation.

## D-006 — 2026-09-15 — No agent framework, no vector DB, no per-turn evaluator

**Decision.** Four plain TypeScript functions (`extractLesson`,
`generateTutorTurn`, `evaluateSession`, `transcribeAudio`), one real
implementation and one mock each. No LangGraph, multi-agent orchestration,
embeddings, Redis or Kubernetes. Evaluation runs once at session end.
**Reason.** The product needs reliability and low cost, not autonomy. A second
LLM per turn is unnecessary until an observed need appears.
**Consequences.** Memory retrieval is a simple SQL selection of relevant
observations. Revisit only with a concrete measured problem.

## D-007 — 2026-09-15 — LLMs propose observations; code owns counters and statuses

**Decision.** Evaluation returns observations with `message_id`,
`message_revision`, `item_id`, exact `evidence_text`, `verdict` (including
`uncertain`) and `assisted`. The code validates references and evidence,
applies events under a unique constraint and recomputes progress with the
documented heuristic (`new` / `learning` / `comfortable`).
**Reason.** Reliability, idempotence on retry, auditability of every counter.
**Consequences.** No JSON can set a status directly. No CEFR level, no
pronunciation score. Assisted/typed turns never count toward oral mastery.

## D-008 — 2026-09-15 — Item identity by language + canonical form + kind + sense

**Decision.** Items are not identified by raw string. NFC normalization only;
inflected variants linked on evidence; doubtful merges stay proposals in
Review lesson.
**Reason.** Same word across lessons must share progress; accents, tones and
scripts must survive.
**Consequences.** No universal lemmatizer in V1. Preserve the photo's script
(no traditional/simplified conversion).

## D-009 — 2026-09-15 — Tap-to-record with explicit transcript confirmation

**Decision.** Record/Stop button, 60-second cap, transcript shown with
Send/Edit/Try again before the tutor sees it. Explicit audio state machine.
**Reason.** Avoids counting a bad transcription as a learner error; keeps the
loop simple and robust on both platforms.
**Consequences.** No continuous conversation or automatic turn detection in
V1. Raw and edited transcripts are both stored with `input_source`.

## D-010 — 2026-09-15 — Private beta with individual codes, quotas and a budget cap

**Decision.** One-use expiring codes → revocable opaque tokens (SecureStore);
server stores hashes only; per-tester daily quotas (initially 3 extractions,
100 turns) and a global spending guard. No accounts, no payments.
**Reason.** Ten friends, real API costs, no need for identity infrastructure.
**Consequences.** Paid calls are refused when quota or budget is exceeded;
local reading keeps working. A pilot envelope of 20–30 € is set aside; the
real per-session cost is measured before inviting more testers.

## D-011 — 2026-09-15 — npm workspaces monorepo, one lockfile

**Decision.** `apps/mobile`, `apps/api`, `packages/contracts` under npm
workspaces. No Nx/Turborepo.
**Reason.** Shared Zod contracts with minimal tooling.
**Consequences.** Windows-friendly commands are documented in milestone 1.

## D-012 — 2026-09-15 — Milestones follow the plan's numbered prompts

**Decision.** Work proceeds one milestone at a time on a branch named
`milestone-N-<slug>`, matching the backlog in `docs/STATUS.md` and the prompts
in `docs/BUILD_PLAN.md` section 12. One writer per branch; review before merge.
**Reason.** Small verifiable steps; repository files are the continuity
between agent sessions.
**Consequences.** No feature is added because an agent suggests it. Humans
keep phone tests and product decisions.

## D-013 — 2026-09-15 — Documentation language

**Decision.** `docs/BUILD_PLAN.md` keeps its original French prose. All other
repository documents, code, comments, commits and UI strings are in English.
**Reason.** The plan is written for Tim; the rest is read by code agents and
testers, and the app UI is English by product decision.
