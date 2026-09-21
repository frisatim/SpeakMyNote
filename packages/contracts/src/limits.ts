/**
 * V1 request limits (docs/ARCHITECTURE.md). Shared so the app can pre-check
 * and the API can enforce. The API is the authority.
 */
export const LIMITS = {
  IMAGE_MAX_BYTES: 5 * 1024 * 1024,
  AUDIO_MAX_BYTES: 10 * 1024 * 1024,
  AUDIO_MAX_SECONDS: 60,
  ACTIVE_WORDS_MAX: 10,
  ACTIVE_GRAMMAR_MAX: 2,
  TUTOR_RECENT_MESSAGES_MAX: 8,
  TUTOR_SUMMARY_MAX_WORDS: 150,
  TUTOR_MEMORY_OBSERVATIONS_MAX: 5,
} as const;
