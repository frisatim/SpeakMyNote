import type { LanguageCode } from '@speakmynotes/contracts';

/**
 * The four provider functions of docs/ARCHITECTURE.md. Input/output contracts
 * are refined in the milestones that implement each route (3, 4, 5, 6); the
 * shapes below are deliberately minimal placeholders for milestone 1.
 */
export interface ExtractLessonInput {
  language: LanguageCode;
  imageBytes: Uint8Array;
  mimeType: string;
}
export interface ExtractLessonOutput {
  title: string;
  items: unknown[];
  warnings: string[];
}

export interface TutorTurnInput {
  language: LanguageCode;
  lessonSnapshot: unknown;
  recentMessages: unknown[];
  userMessage: string;
}
export interface TutorTurnOutput {
  replyText: string;
  reading: string | null;
  meaningEn: string;
  correctionEn: string | null;
}

export interface EvaluateSessionInput {
  language: LanguageCode;
  lessonSnapshot: unknown;
  messages: unknown[];
}
export interface EvaluateSessionOutput {
  observations: unknown[];
  summaryEn: string;
}

export interface TranscribeAudioInput {
  language: LanguageCode;
  audioBytes: Uint8Array;
  mimeType: string;
  hints: string[];
}
export interface TranscribeAudioOutput {
  text: string;
  durationSeconds: number | null;
}

export interface Providers {
  readonly mode: 'mock' | 'live';
  extractLesson(input: ExtractLessonInput): Promise<ExtractLessonOutput>;
  generateTutorTurn(input: TutorTurnInput): Promise<TutorTurnOutput>;
  evaluateSession(input: EvaluateSessionInput): Promise<EvaluateSessionOutput>;
  transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput>;
}
