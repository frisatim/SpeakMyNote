import { z } from 'zod';

const NodeEnvSchema = z.enum(['development', 'test', 'production']);
const ProviderModeSchema = z.enum(['mock', 'live']);
const BooleanStringSchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const nonEmpty = (name: string) => z.string().trim().min(1, `${name} is required in live provider mode`);

const BaseEnvSchema = z.object({
  NODE_ENV: NodeEnvSchema.default('development'),
  HOST: z.string().trim().min(1).default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  PROVIDER_MODE: ProviderModeSchema.default('mock'),
  ALLOW_MOCK_PROVIDERS_IN_PRODUCTION: BooleanStringSchema.default(false),
});

const LiveProvidersSchema = z.object({
  GEMINI_API_KEY: nonEmpty('GEMINI_API_KEY'),
  VISION_MODEL: nonEmpty('VISION_MODEL'),
  TUTOR_MODEL: nonEmpty('TUTOR_MODEL'),
  EVALUATOR_MODEL: nonEmpty('EVALUATOR_MODEL'),
  OPENAI_API_KEY: nonEmpty('OPENAI_API_KEY'),
  STT_MODEL: nonEmpty('STT_MODEL'),
});

export type LiveProviderConfig = z.infer<typeof LiveProvidersSchema>;

export type AppConfig = {
  nodeEnv: z.infer<typeof NodeEnvSchema>;
  host: string;
  port: number;
  logLevel: z.infer<typeof BaseEnvSchema>['LOG_LEVEL'];
  providerMode: 'mock' | 'live';
  /** Present only in live mode. Never log or expose it. */
  live: LiveProviderConfig | null;
};

export class ConfigError extends Error {
  override readonly name = 'ConfigError';
  constructor(message: string) {
    super(message);
  }
}

function formatIssues(prefix: string, issues: z.core.$ZodIssue[]): string {
  const lines = issues.map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  return `${prefix}\n${lines.join('\n')}`;
}

/**
 * Validates process.env into a typed config. Throws ConfigError with a clear,
 * secret-free message. Rules:
 *  - mock mode needs no keys;
 *  - live mode requires every key and model ID;
 *  - production refuses mock mode unless explicitly allowed.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const base = BaseEnvSchema.safeParse(env);
  if (!base.success) {
    throw new ConfigError(formatIssues('Invalid environment configuration:', base.error.issues));
  }
  const { NODE_ENV, HOST, PORT, LOG_LEVEL, PROVIDER_MODE, ALLOW_MOCK_PROVIDERS_IN_PRODUCTION } = base.data;

  if (NODE_ENV === 'production' && PROVIDER_MODE === 'mock' && !ALLOW_MOCK_PROVIDERS_IN_PRODUCTION) {
    throw new ConfigError(
      'Refusing to start: PROVIDER_MODE=mock in production. Set PROVIDER_MODE=live with real keys, ' +
        'or set ALLOW_MOCK_PROVIDERS_IN_PRODUCTION=true only for a deliberate non-beta test.',
    );
  }

  let live: LiveProviderConfig | null = null;
  if (PROVIDER_MODE === 'live') {
    const parsed = LiveProvidersSchema.safeParse(env);
    if (!parsed.success) {
      throw new ConfigError(formatIssues('PROVIDER_MODE=live but provider configuration is incomplete:', parsed.error.issues));
    }
    live = parsed.data;
  }

  return { nodeEnv: NODE_ENV, host: HOST, port: PORT, logLevel: LOG_LEVEL, providerMode: PROVIDER_MODE, live };
}
