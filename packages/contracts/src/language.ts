import { z } from 'zod';

/** Target languages supported in V1. Nothing else is accepted by the API. */
export const SUPPORTED_LANGUAGES = ['zh', 'ko', 'fr'] as const;

export const LanguageCodeSchema = z.enum(SUPPORTED_LANGUAGES);
export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

/** The only support/explanation language in V1. */
export const SUPPORT_LANGUAGE = 'en' as const;
export const SupportLanguageSchema = z.literal(SUPPORT_LANGUAGE);
export type SupportLanguage = z.infer<typeof SupportLanguageSchema>;

export const LANGUAGE_LABELS_EN: Record<LanguageCode, string> = {
  zh: 'Chinese',
  ko: 'Korean',
  fr: 'French',
};

/**
 * Initial TTS locales. Starting choices only: real voice availability is
 * checked on physical phones (see docs/PRODUCT.md).
 */
export const LANGUAGE_TTS_LOCALES: Record<LanguageCode, string> = {
  zh: 'zh-CN',
  ko: 'ko-KR',
  fr: 'fr-FR',
};

/** Whether the language has a reading (pinyin / romanization). French has none. */
export const LANGUAGE_HAS_READING: Record<LanguageCode, boolean> = {
  zh: true,
  ko: true,
  fr: false,
};

export function isLanguageCode(value: unknown): value is LanguageCode {
  return LanguageCodeSchema.safeParse(value).success;
}
