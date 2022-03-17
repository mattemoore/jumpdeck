const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// add your private routes here
const exclude = ['/dashboard/*', '/settings/*', '/onboarding/*']

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude,
};
