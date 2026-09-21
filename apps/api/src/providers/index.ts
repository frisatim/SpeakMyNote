import type { AppConfig } from '../config.ts';
import { createLiveProviders } from './live.ts';
import { createMockProviders } from './mock.ts';
import type { Providers } from './types.ts';

export type { Providers } from './types.ts';

/** Explicit selection: never falls back to mocks when live was requested. */
export function createProviders(config: AppConfig): Providers {
  if (config.providerMode === 'live') {
    if (!config.live) {
      throw new Error('Live provider mode selected without live configuration');
    }
    return createLiveProviders(config.live);
  }
  return createMockProviders();
}
