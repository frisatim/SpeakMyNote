import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { AppError } from '../errors.ts';

/**
 * Turns every error into the structured contract. Internal messages are never
 * echoed to clients for unexpected errors; they are logged with the request ID.
 */
export function registerErrorHandler(app: FastifyInstance): void {
  app.setNotFoundHandler((request, reply) => {
    const error = new AppError('NOT_FOUND', `Route ${request.method} ${request.url} not found`);
    void reply.status(error.statusCode).send(error.toBody(request.id));
  });

  app.setErrorHandler((error: unknown, request, reply) => {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof ZodError) {
      appError = new AppError('VALIDATION_ERROR', 'Request validation failed', {
        details: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      });
    } else if (isFastifyError(error) && error.statusCode === 413) {
      appError = new AppError('PAYLOAD_TOO_LARGE', 'Request body is too large');
    } else if (isFastifyError(error) && error.statusCode !== undefined && error.statusCode >= 400 && error.statusCode < 500) {
      appError = new AppError('VALIDATION_ERROR', error.message, { statusCode: error.statusCode });
    } else {
      request.log.error({ err: error, request_id: request.id }, 'Unhandled error');
      appError = new AppError('INTERNAL_ERROR', 'Unexpected server error');
    }

    void reply.status(appError.statusCode).send(appError.toBody(request.id));
  });
}

function isFastifyError(error: unknown): error is Error & { statusCode?: number } {
  return error instanceof Error && 'statusCode' in error;
}
