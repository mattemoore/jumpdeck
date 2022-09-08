import pino from 'pino';
import configuration from '~/configuration';

const logger = pino({
  browser: {},
  level: 'debug',
  transport: getTransport(),
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
  },
});

function getTransport() {
  if (configuration.production) {
    return undefined;
  }

  return getPinoPrettyConfig();
}

function getPinoPrettyConfig() {
  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

export default logger;
