import { LayoutStyle } from '~/core/layout-style';

const configuration = {
  site: {
    name: 'Your SaaS Name',
    description: 'Your SaaS Description',
    themeColor: '#efee00',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL as string,
    siteName: 'Awesomely',
    twitterHandle: '',
    githubHandle: '',
    language: 'en',
    convertKitFormId: '',
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  emulatorHost: process.env.NEXT_PUBLIC_EMULATOR_HOST,
  emulator: process.env.NEXT_PUBLIC_EMULATOR === 'true',
  production: process.env.NODE_ENV === 'production',
  autoBanners: true,
  paths: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    onboarding: `/onboarding`,
    appHome: '/dashboard',
    api: {
      checkout: `/api/stripe/checkout`,
      billingPortal: `/api/stripe/portal`,
    },
    searchIndex: `/public/search-index`,
  },
  navigation: {
    style: LayoutStyle.Sidebar,
  },
  email: {
    host: '',
    port: 0,
    user: '',
    password: '',
    senderAddress: '',
  },
  emailEtherealTestAccount: {
    email: process.env.ETHEREAL_EMAIL,
    password: process.env.ETHEREAL_PASSWORD,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  plans: [
    {
      name: 'Basic',
      description: 'Description of your Basic plan',
      price: '$249/year',
      stripePriceId: 'basic-plan',
    },
    {
      name: 'Pro',
      description: 'Description of your Pro plan',
      price: '$999/year',
      stripePriceId: '',
    },
  ],
  testingPlans: [
    {
      name: 'Testing Plan',
      description: 'Description of your Testing plan',
      price: '$999/year',
      stripePriceId: 'price_1LFibmKr5l4rxPx3wWcSO8UY',
    },
  ],
};

export default configuration;
