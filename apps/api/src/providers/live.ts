import { AppError } from '../errors.ts';
import type { LiveProviderConfig } from '../config.ts';
import type { Providers } from './types.ts';

/**
 * Live providers are implemented in milestones 3 (Gemini vision), 4 (Gemini
 * tutor), 5 (OpenAI transcription) and 6 (Gemini evaluation). Until then a
 * live-mode server starts (keys validated) but every provider call returns a
 * structured PROVIDER_NOT_IMPLEMENTED error instead of silently using mocks.
 */
export function createLiveProviders(_config: LiveProviderConfig): Providers {
  const notImplemented = (name: string) => async (): Promise<never> => {
    throw new AppError('PROVIDER_NOT_IMPLEMENTED', `${name} live adapter is not implemented yet`);
  };
  return {
    mode: 'live',
    extractLesson: notImplemented('extractLesson'),
    generateTutorTurn: notImplemented('generateTutorTurn'),
    evaluateSession: notImplemented('evaluateSession'),
    transcribeAudio: notImplemented('transcribeAudio'),
  };
}
