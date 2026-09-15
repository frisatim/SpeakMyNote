import { describe, expect, it } from 'vitest';

import { HealthResponseSchema, ApiErrorSchema } from './api.ts';
import { LANGUAGE_HAS_READING, LanguageCodeSchema, SUPPORTED_LANGUAGES, isLanguageCode } from './language.ts';

describe('LanguageCodeSchema', () => {
  it('accepts exactly zh, ko and fr', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['zh', 'ko', 'fr']);
    for (const code of SUPPORTED_LANGUAGES) {
      expect(LanguageCodeSchema.parse(code)).toBe(code);
    }
  });

  it('rejects other languages and casing variants', () => {
    for (const bad of ['en', 'ja', 'ZH', 'zh-CN', '', null, 42]) {
      expect(isLanguageCode(bad)).toBe(false);
    }
  });

  it('marks French as having no reading', () => {
    expect(LANGUAGE_HAS_READING.fr).toBe(false);
    expect(LANGUAGE_HAS_READING.zh).toBe(true);
    expect(LANGUAGE_HAS_READING.ko).toBe(true);
  });
});

describe('API schemas', () => {
  it('validates a health payload', () => {
    const result = HealthResponseSchema.safeParse({
      status: 'ok',
      service: 'speak-my-notes-api',
      version: '0.1.0',
      provider_mode: 'mock',
      environment: 'development',
      uptime_seconds: 1.5,
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it('requires the structured error fields', () => {
    expect(ApiErrorSchema.safeParse({ code: 'NOT_FOUND', message: 'x', retryable: false, request_id: 'r' }).success).toBe(true);
    expect(ApiErrorSchema.safeParse({ code: 'NOT_FOUND', message: 'x' }).success).toBe(false);
    expect(ApiErrorSchema.safeParse({ code: 'WHATEVER', message: 'x', retryable: false, request_id: null }).success).toBe(false);
  });
});
