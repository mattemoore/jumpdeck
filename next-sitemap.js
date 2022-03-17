const isProduction = process.env.NODE_ENV === 'production';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const { i18n } = require('./next-i18next.config');
const defaultLocale = i18n.defaultLocale;
const defaultLocaleSegment = `/${defaultLocale}/`;

const exclude = isProduction
  ? ['/dashboard*', '/settings/*', '/onboarding*']
  : ['*'];

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude,
  transform: (config, path) => {
    // fixes a small bug in next-sitemap
    // as it generates URLs with the default locale appended to the URL
    if (path.includes(defaultLocaleSegment)) {
      path = path.replace(defaultLocaleSegment, '');
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
