import { GetServerSidePropsContext } from 'next';
import configuration from '../../configuration';

import { getLoggedInUser } from '~/core/firebase/admin/auth/get-logged-in-user';
import { withTranslationProps } from '~/lib/props/with-translation-props';
import { initializeFirebaseAdminApp } from '~/core/firebase/admin/initialize-firebase-admin-app';
import createCsrfToken from '~/core/generic/create-csrf-token';

const DEFAULT_OPTIONS = {
  redirectPath: configuration.paths.appHome,
  locale: configuration.site.locale ?? 'en',
  localeNamespaces: [],
};

/**
 * @description A server props pipe to deny access to auth pages while logged in
 * For example, this is to be used in pages where logged-in users are not
 * supposes to see, like the sign in page
 * @param ctx
 * @param options
 */
export async function withAuthProps(
  ctx: GetServerSidePropsContext,
  options = DEFAULT_OPTIONS
) {
  if (ctx.query.signOut) {
    return continueToLoginPage(ctx, options);
  }

  try {
    await initializeFirebaseAdminApp();

    // test the user is logged in
    await getLoggedInUser(ctx);

    // if yes, then redirect to "redirectPath"
    return {
      redirect: {
        permanent: false,
        destination: options.redirectPath,
      },
    };
  } catch (e) {
    // if the user is NOT logged in, we redirect to the authentication page
    // as requested by the user
    return continueToLoginPage(ctx, options);
  }
}

async function continueToLoginPage(
  ctx: GetServerSidePropsContext,
  options: typeof DEFAULT_OPTIONS
) {
  const { props } = await withTranslationProps({
    ...options,
    locale: ctx.locale ?? options.locale,
  });

  const csrfToken = await createCsrfToken(ctx);

  return {
    props: {
      ...props,
      csrfToken,
    },
  };
}
