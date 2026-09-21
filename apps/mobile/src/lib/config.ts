/**
 * Public, non-secret mobile configuration.
 *
 * Only EXPO_PUBLIC_* variables are available in the app bundle and all of them
 * are public. Provider keys never belong here (see AGENTS.md).
 */
const DEFAULT_API_URL = 'http://localhost:3000';

function readApiUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!raw) {
    return DEFAULT_API_URL;
  }
  return raw.replace(/\/+$/, '');
}

export const config = {
  apiUrl: readApiUrl(),
  isConfiguredApiUrl: Boolean(process.env.EXPO_PUBLIC_API_URL?.trim()),
} as const;
