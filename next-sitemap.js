const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// add your private routes here
const exclude = ['/dashboard/*', '/settings/*', '/onboarding/*', '/tags*']

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '*.json$',
          '/*_buildManifest.js$',
          '/*_middlewareManifest.js$',
          '/*_ssgManifest.js$',
          '/*.js$'
        ]
      },
    ],
  },
  exclude,
};
