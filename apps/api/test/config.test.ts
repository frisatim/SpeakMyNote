import { describe, expect, it } from 'vitest';

import { ConfigError, loadConfig } from '../src/config.ts';

const LIVE_ENV = {
  PROVIDER_MODE: 'live',
  GEMINI_API_KEY: 'test-gemini',
  VISION_MODEL: 'vision-model',
  TUTOR_MODEL: 'tutor-model',
  EVALUATOR_MODEL: 'eval-model',
  OPENAI_API_KEY: 'test-openai',
  STT_MODEL: 'stt-model',
};

describe('loadConfig', () => {
  it('defaults to mock mode in development without any key', () => {
    const config = loadConfig({});
    expect(config.providerMode).toBe('mock');
    expect(config.nodeEnv).toBe('development');
    expect(config.port).toBe(3000);
    expect(config.live).toBeNull();
  });

  it('requires every key and model ID in live mode', () => {
    expect(() => loadConfig({ PROVIDER_MODE: 'live' })).toThrow(ConfigError);
    expect(() => loadConfig({ ...LIVE_ENV, STT_MODEL: '' })).toThrow(/STT_MODEL/);
    const config = loadConfig(LIVE_ENV);
    expect(config.providerMode).toBe('live');
    expect(config.live?.VISION_MODEL).toBe('vision-model');
  });

  it('refuses mock mode in production unless explicitly allowed', () => {
    expect(() => loadConfig({ NODE_ENV: 'production', PROVIDER_MODE: 'mock' })).toThrow(/Refusing to start/);
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow(/Refusing to start/);
    const allowed = loadConfig({ NODE_ENV: 'production', PROVIDER_MODE: 'mock', ALLOW_MOCK_PROVIDERS_IN_PRODUCTION: 'true' });
    expect(allowed.providerMode).toBe('mock');
  });

  it('rejects invalid values with a readable message', () => {
    expect(() => loadConfig({ PORT: 'abc' })).toThrow(/PORT/);
    expect(() => loadConfig({ PROVIDER_MODE: 'maybe' })).toThrow(/PROVIDER_MODE/);
  });
});
