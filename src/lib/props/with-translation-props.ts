import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type Options = {
  locale: string;
  localeNamespaces: string[];
};

const DEFAULT_LOCALE = 'en';

// by default, we provide all the translations available
// if they get very big, you could pick only the ones actually used on the page
// we recommend to always pick at least "common" by default
const DEFAULT_OPTIONS: Options = {
  locale: DEFAULT_LOCALE,
  localeNamespaces: [
    'common',
    'auth',
    'organization',
    'profile',
    'subscription',
  ],
};

/**
 * @name withTranslationProps
 * @param options
 * @description This server side props pipe is to be used for any page that
 * is using i18n; otherwise, the translation strings won't be loaded
 */
export async function withTranslationProps(options?: Options) {
  const { localeNamespaces, locale } = mergeOptions(options);
  const translation = await serverSideTranslations(locale, localeNamespaces);

  return {
    props: {
      ...translation,
    },
  };
}

function mergeOptions(options?: Options) {
  return {
    locale: options?.locale ?? DEFAULT_OPTIONS.locale,
    localeNamespaces: [
      ...(options?.localeNamespaces ?? []),
      ...DEFAULT_OPTIONS.localeNamespaces,
    ],
  };
}
