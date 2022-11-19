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
  // SWC minification breaks AppCheck. You may set to true if you're not
  // interested in using Firebase AppCheck
  swcMinify: false,
  // please disable if too verbose while developing. No judgment
  reactStrictMode: true,
  images: {
    domains: getConfiguredDomains(),
    // enable this to opt-in image optimization (mind the Vercel limits)
    unoptimized: true,
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

    // we remove unnecessary Firebase packages
    // only in production due to tree shaking
    if (isProduction) {
      decorateConfigWithFirebaseExternals(config);
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
  ].filter(Boolean);
}

/**
 * @description We work around a bug in Reactfire that cause the bundle to
 * be mich bigger that it needs to be.
 *
 * If you need any of the below Firebase packages, please remove it from the
 * list.
 *
 * Bug: https://github.com/FirebaseExtended/reactfire/issues/489
 * @param config
 */
function decorateConfigWithFirebaseExternals(config) {
  config.externals = [
    ...(config.externals ?? []),
    {
      'firebase/functions': 'root Math',
      'firebase/database': 'root Math',
      'firebase/performance': 'root Math',
      'firebase/remote-config': 'root Math'
    },
  ];
}
