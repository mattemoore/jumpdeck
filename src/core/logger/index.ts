import pino from 'pino';
import configuration from '~/configuration';

function getPino() {
  const isDev = !configuration.production;

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
      env: process.env.NODE_ENV,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  });
}

export default getPino();
