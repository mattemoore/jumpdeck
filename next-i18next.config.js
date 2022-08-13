const { resolve } = require('path');

/**
 * @type {import("next/dist/server/config-shared").I18NConfig}
 */
const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  localePath: resolve('./public/locales'),
};

module.exports = config;
