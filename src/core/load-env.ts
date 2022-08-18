import { loadEnvConfig } from '@next/env';

// call {loadEnvConfig} before importing "configuration" to populate the
// environment variables. This is useful for scripts executed outside
// Next.js, not application code, because the Next.js commands do it
// automatically
loadEnvConfig('.');
