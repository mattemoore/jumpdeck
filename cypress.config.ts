import { defineConfig } from 'cypress';
import { loadEnvConfig } from '@next/env';
import configuration from '~/configuration';

// load environment variables from .env
loadEnvConfig('.');

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  video: false,
  chromeWebSecurity: false,
  port: 4600,
  viewportWidth: 1920,
  viewportHeight: 1080,
  pageLoadTimeout: 60000,
  retries: {
    runMode: 2,
    openMode: 1,
  },
  env: getEnv(),
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts').default(on, config);
    },
    defaultCommandTimeout: 10000,
    slowTestThreshold: 5000,
    baseUrl: 'http://localhost:3000',
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: getExcludeSpecPattern(),
  },
});

function getExcludeSpecPattern() {
  const enableStripeTests = process.env.ENABLE_STRIPE_TESTING === 'true';
  const enableThemeTests = configuration.enableThemeSwitcher;

  const excludePatterns = [];

  if (!enableStripeTests) {
    excludePatterns.push('**/stripe/*');
  }

  if (!enableThemeTests) {
    excludePatterns.push('**/theme.cy.ts');
  }

  return excludePatterns;
}

function getEnv() {
  const env = process.env;

  const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  const FIREBASE_PROJECT_ID = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const FIREBASE_API_KEY = env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const FIREBASE_APP_ID = env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const FIREBASE_STORAGE_BUCKET = env.FIREBASE_STORAGE_BUCKET;
  const FIREBASE_EMULATOR_HOST = env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;
  const FIREBASE_AUTH_EMULATOR_PORT =
    env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT;

  const USER_EMAIL = env.USER_EMAIL;
  const USER_PASSWORD = env.USER_PASSWORD;

  return {
    STRIPE_WEBHOOK_SECRET,
    FIREBASE_API_KEY,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_APP_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_EMULATOR_HOST,
    FIREBASE_AUTH_EMULATOR_PORT,
    USER_EMAIL,
    USER_PASSWORD,
  };
}
