import type { HealthResponse } from '@speakmynotes/contracts';
import { HealthResponseSchema } from '@speakmynotes/contracts';
import type { FastifyInstance } from 'fastify';

import type { AppConfig } from '../config.ts';

export function registerHealthRoute(app: FastifyInstance, config: AppConfig, version: string): void {
  const startedAt = Date.now();

  app.get('/health', async () => {
    const body: HealthResponse = {
      status: 'ok',
      service: 'speak-my-notes-api',
      version,
      provider_mode: config.providerMode,
      environment: config.nodeEnv,
      uptime_seconds: Math.round((Date.now() - startedAt) / 100) / 10,
      timestamp: new Date().toISOString(),
    };
    // Guard against accidentally leaking configuration: the schema is closed.
    return HealthResponseSchema.parse(body);
  });
}
