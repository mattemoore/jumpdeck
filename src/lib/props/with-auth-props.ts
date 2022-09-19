import { GetServerSidePropsContext } from 'next';
import configuration from '../../configuration';

import { getLoggedInUser } from '~/core/firebase/admin/auth/get-logged-in-user';
import { withTranslationProps } from '~/lib/props/with-translation-props';
import { initializeFirebaseAdminApp } from '~/core/firebase/admin/initialize-firebase-admin-app';
import createCsrfToken from '~/core/generic/create-csrf-token';

const DEFAULT_OPTIONS = {
  redirectPath: configuration.paths.appHome,
  locale: 'en',
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
  const { redirectPath } = options;

  try {
    await initializeFirebaseAdminApp();

    // test the user is logged in
    const user = await getLoggedInUser(ctx);

    console.log(new Date(user.auth_time * 1000));

    // if yes, then redirect to "redirectPath"
    const { props } = await withTranslationProps(options);
    const csrfToken = await createCsrfToken(ctx);

    return {
      props: {
        ...props,
        csrfToken,
      },
    };
  } catch (e) {
    // if the user is NOT logged in, we redirect to the authentication page
    // as requested by the user
    const { props } = await withTranslationProps(options);
    const csrfToken = await createCsrfToken(ctx);

    return {
      props: {
        ...props,
        csrfToken,
      },
    };
  }
}
