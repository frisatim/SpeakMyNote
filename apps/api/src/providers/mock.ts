import type { Providers } from './types.ts';

/**
 * Deterministic development providers. No network, no keys, no cost.
 * Results are clearly labelled so nobody mistakes them for model output.
 */
export function createMockProviders(): Providers {
  return {
    mode: 'mock',
    async extractLesson(input) {
      return { title: `[MOCK] Lesson (${input.language})`, items: [], warnings: ['mock provider: no extraction performed'] };
    },
    async generateTutorTurn(input) {
      return {
        replyText: `[MOCK ${input.language}] ${input.userMessage}`,
        reading: null,
        meaningEn: '[MOCK] Echo of your message.',
        correctionEn: null,
      };
    },
    async evaluateSession() {
      return { observations: [], summaryEn: '[MOCK] No evaluation performed.' };
    },
    async transcribeAudio() {
      return { text: '[MOCK] transcript', durationSeconds: null };
    },
  };
}
