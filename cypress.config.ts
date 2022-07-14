import { defineConfig } from 'cypress';
import { loadEnvConfig } from '@next/env';

// load environment variables from .env
loadEnvConfig('.');

const ENABLE_STRIPE_TESTING = process.env.ENABLE_STRIPE_TESTING;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

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
    runMode: 3,
    openMode: 3,
  },
  env: {
    EMAIL: 'test@makerkit.dev',
    PASSWORD: 'testingpassword',
    STRIPE_WEBHOOK_SECRET,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts').default(on, config);
    },
    defaultCommandTimeout: 15000,
    slowTestThreshold: 5000,
    baseUrl: 'http://localhost:3000',
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: ENABLE_STRIPE_TESTING ? [] : ['./cypress/e2e/stripe/*'],
  },
});
