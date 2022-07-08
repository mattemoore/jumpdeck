import withBundleAnalyzer from "@next/bundle-analyzer";
import i18nConfig from "./next-i18next.config.js";

const analyzeBundleEnabled = process.env.ANALYZE === "true";
const isProduction = process.env.NODE_ENV === "production";

const MS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

/**
 * @type {import("next").NextConfig}
 */
const config = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // not working with Firebase yet, please do not change
  swcMinify: false,
  // please disable if too verbose while developing. No judgment
  reactStrictMode: true,
  images: {
    domains: getConfiguredDomains()
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: SECONDS_PER_DAY * MS_PER_SECOND,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 100,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },
  i18n: i18nConfig.i18n
};

const nextConfig = withBundleAnalyzer({
  enabled: analyzeBundleEnabled
})(config);

export default nextConfig;

/**
 * @description Returns the configured domains for Next Image's component
 * If we're in production mode, then we use the Firebase Storage bucket set
 * in the environment variables; otherwise, we simply use localhost
 * Check: https://nextjs.org/docs/messages/next-image-unconfigured-host
 */
function getConfiguredDomains() {
  const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  return [
    isProduction ? firebaseStorageBucket : "localhost"
  ];
}
