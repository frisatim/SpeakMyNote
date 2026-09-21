import type { ApiError, ApiErrorCode } from '@speakmynotes/contracts';

const DEFAULT_STATUS: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  RATE_LIMITED: 429,
  PAYLOAD_TOO_LARGE: 413,
  PROVIDER_ERROR: 502,
  PROVIDER_NOT_IMPLEMENTED: 501,
  TIMEOUT: 504,
  INTERNAL_ERROR: 500,
};

const DEFAULT_RETRYABLE: Record<ApiErrorCode, boolean> = {
  VALIDATION_ERROR: false,
  NOT_FOUND: false,
  UNAUTHORIZED: false,
  RATE_LIMITED: true,
  PAYLOAD_TOO_LARGE: false,
  PROVIDER_ERROR: true,
  PROVIDER_NOT_IMPLEMENTED: false,
  TIMEOUT: true,
  INTERNAL_ERROR: false,
};

/**
 * Throw this anywhere in a route to produce the structured error contract
 * `{ code, message, retryable, request_id }` (docs/ARCHITECTURE.md).
 */
export class AppError extends Error {
  override readonly name = 'AppError';
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly retryable: boolean;
  readonly details: unknown;

  constructor(
    code: ApiErrorCode,
    message: string,
    options: { statusCode?: number; retryable?: boolean; details?: unknown; cause?: unknown } = {},
  ) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.code = code;
    this.statusCode = options.statusCode ?? DEFAULT_STATUS[code];
    this.retryable = options.retryable ?? DEFAULT_RETRYABLE[code];
    this.details = options.details;
  }

  toBody(requestId: string | null): ApiError {
    const body: ApiError = { code: this.code, message: this.message, retryable: this.retryable, request_id: requestId };
    if (this.details !== undefined) {
      body.details = this.details;
    }
    return body;
  }
}
