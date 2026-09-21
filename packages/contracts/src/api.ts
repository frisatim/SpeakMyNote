import { z } from 'zod';

/** Every API error body has this exact shape (docs/ARCHITECTURE.md). */
export const ApiErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'UNAUTHORIZED',
  'RATE_LIMITED',
  'PAYLOAD_TOO_LARGE',
  'PROVIDER_ERROR',
  'PROVIDER_NOT_IMPLEMENTED',
  'TIMEOUT',
  'INTERNAL_ERROR',
]);
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;

export const ApiErrorSchema = z.object({
  code: ApiErrorCodeSchema,
  message: z.string(),
  retryable: z.boolean(),
  request_id: z.string().nullable(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/** Provider mode is reported by /health so the app can label mock results. */
export const ProviderModeSchema = z.enum(['mock', 'live']);
export type ProviderMode = z.infer<typeof ProviderModeSchema>;

/** GET /health response. Must never contain secret configuration. */
export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('speak-my-notes-api'),
  version: z.string(),
  provider_mode: ProviderModeSchema,
  environment: z.enum(['development', 'test', 'production']),
  uptime_seconds: z.number().nonnegative(),
  timestamp: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
