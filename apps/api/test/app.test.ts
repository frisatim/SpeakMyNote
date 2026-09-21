import { ApiErrorSchema, HealthResponseSchema } from '@speakmynotes/contracts';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildApp } from '../src/app.ts';
import { loadConfig } from '../src/config.ts';
import { AppError } from '../src/errors.ts';

const app = buildApp(loadConfig({ NODE_ENV: 'test', PROVIDER_MODE: 'mock' }));

beforeAll(async () => {
  app.get('/__test/boom', async () => {
    throw new Error('secret internal detail');
  });
  app.get('/__test/app-error', async () => {
    throw new AppError('RATE_LIMITED', 'Slow down');
  });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('GET /health', () => {
  it('returns the health contract without secrets', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    const body = HealthResponseSchema.parse(response.json());
    expect(body.provider_mode).toBe('mock');
    expect(body.environment).toBe('test');
    expect(JSON.stringify(body)).not.toMatch(/KEY|secret/i);
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('echoes a safe incoming x-request-id', async () => {
    const response = await app.inject({ method: 'GET', url: '/health', headers: { 'x-request-id': 'abc-123' } });
    expect(response.headers['x-request-id']).toBe('abc-123');
  });
});

describe('structured errors', () => {
  it('formats unknown routes as NOT_FOUND', async () => {
    const response = await app.inject({ method: 'GET', url: '/nope' });
    expect(response.statusCode).toBe(404);
    const body = ApiErrorSchema.parse(response.json());
    expect(body.code).toBe('NOT_FOUND');
    expect(body.retryable).toBe(false);
    expect(body.request_id).toBe(response.headers['x-request-id']);
  });

  it('hides internal error details', async () => {
    const response = await app.inject({ method: 'GET', url: '/__test/boom' });
    expect(response.statusCode).toBe(500);
    const body = ApiErrorSchema.parse(response.json());
    expect(body.code).toBe('INTERNAL_ERROR');
    expect(body.message).not.toContain('secret internal detail');
  });

  it('passes AppError code, status and retryable through', async () => {
    const response = await app.inject({ method: 'GET', url: '/__test/app-error' });
    expect(response.statusCode).toBe(429);
    const body = ApiErrorSchema.parse(response.json());
    expect(body).toMatchObject({ code: 'RATE_LIMITED', message: 'Slow down', retryable: true });
  });

  it('rejects malformed JSON bodies as VALIDATION_ERROR', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/health',
      headers: { 'content-type': 'application/json' },
      payload: '{not json',
    });
    expect([400, 404]).toContain(response.statusCode);
    const body = ApiErrorSchema.parse(response.json());
    expect(['VALIDATION_ERROR', 'NOT_FOUND']).toContain(body.code);
  });
});

describe('providers', () => {
  it('exposes mock providers that label their output', async () => {
    expect(app.providers.mode).toBe('mock');
    const turn = await app.providers.generateTutorTurn({ language: 'fr', lessonSnapshot: null, recentMessages: [], userMessage: 'Bonjour' });
    expect(turn.replyText).toContain('[MOCK');
  });
});
