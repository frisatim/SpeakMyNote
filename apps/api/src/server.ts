import { buildApp } from './app.ts';
import { ConfigError, loadConfig } from './config.ts';

async function main(): Promise<void> {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }

  const app = buildApp(config);
  app.log.info({ provider_mode: config.providerMode, environment: config.nodeEnv }, 'Starting Speak My Notes API');
  if (config.providerMode === 'mock') {
    app.log.warn('PROVIDER_MODE=mock: AI results are deterministic fixtures, not model output');
  }

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, 'Shutting down');
    await app.close();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  try {
    await app.listen({ host: config.host, port: config.port });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void main();
