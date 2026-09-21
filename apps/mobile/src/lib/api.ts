import { ApiErrorSchema, HealthResponseSchema, type ApiError, type HealthResponse } from '@speakmynotes/contracts';

import { config } from './config';

export type HealthResult =
  | { ok: true; health: HealthResponse }
  | { ok: false; error: ApiError | { code: 'NETWORK_ERROR'; message: string; retryable: true; request_id: null } };

const HEALTH_TIMEOUT_MS = 5000;

/**
 * Calls GET /health on the configured API. Never throws: network and parsing
 * failures are returned as structured errors so screens can render them.
 */
export async function fetchHealth(signal?: AbortSignal): Promise<HealthResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  try {
    const response = await fetch(`${config.apiUrl}/health`, { signal: controller.signal });
    const body: unknown = await response.json();

    if (!response.ok) {
      const parsed = ApiErrorSchema.safeParse(body);
      if (parsed.success) {
        return { ok: false, error: parsed.data };
      }
      return {
        ok: false,
        error: { code: 'NETWORK_ERROR', message: `API returned HTTP ${response.status}`, retryable: true, request_id: null },
      };
    }

    const health = HealthResponseSchema.safeParse(body);
    if (!health.success) {
      return {
        ok: false,
        error: { code: 'NETWORK_ERROR', message: 'API returned an unexpected health payload', retryable: true, request_id: null },
      };
    }
    return { ok: true, health: health.data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    return { ok: false, error: { code: 'NETWORK_ERROR', message, retryable: true, request_id: null } };
  } finally {
    clearTimeout(timeout);
  }
}
