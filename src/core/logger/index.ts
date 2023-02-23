import pino from 'pino';
import configuration from '~/configuration';

/**
 * @name getPino
 * @description Get a Pino logger instance
 */
function getPino() {
  const isDev = !configuration.production;

  // we inject "pino-pretty" only in dev mode to make our console logs look nice
  if (isDev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pretty = require('pino-pretty');

    return pino(
      {},
      pretty({
        colorize: true,
      })
    );
  }

  return pino({
    browser: {},
    level: 'debug',
    base: {
      env: configuration.environment,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  });
}

export default getPino();
