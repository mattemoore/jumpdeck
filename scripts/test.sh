set -e

npm run dev:test & npm run stripe:mock-server &
npm run cypress:headless
exit 0