import { randomUUID } from 'node:crypto';

import Fastify, { type FastifyInstance } from 'fastify';

import type { AppConfig } from './config.ts';
import { registerErrorHandler } from './plugins/error-handler.ts';
import { createProviders, type Providers } from './providers/index.ts';
import { registerHealthRoute } from './routes/health.ts';

export const API_VERSION = '0.1.0';

/** V1 default body limit; per-route limits for images/audio come with their routes. */
const DEFAULT_BODY_LIMIT_BYTES = 1024 * 1024;

declare module 'fastify' {
  interface FastifyInstance {
    config: AppConfig;
    providers: Providers;
  }
}

export function buildApp(config: AppConfig): FastifyInstance {
  const app = Fastify({
    logger: config.nodeEnv === 'test' ? false : { level: config.logLevel },
    genReqId: (request) => {
      const incoming = request.headers['x-request-id'];
      return typeof incoming === 'string' && /^[A-Za-z0-9._-]{1,128}$/.test(incoming) ? incoming : randomUUID();
    },
    requestIdHeader: false,
    bodyLimit: DEFAULT_BODY_LIMIT_BYTES,
    trustProxy: false,
  });

  app.decorate('config', config);
  app.decorate('providers', createProviders(config));

  app.addHook('onSend', async (request, reply) => {
    reply.header('x-request-id', request.id);
  });

  registerErrorHandler(app);
  registerHealthRoute(app, config, API_VERSION);

  return app;
}
