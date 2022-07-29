import { GetServerSidePropsContext } from 'next';
import configuration from '../../configuration';

import { getLoggedInUser } from '~/core/firebase/admin/auth/get-logged-in-user';
import { withTranslationProps } from '~/lib/props/with-translation-props';

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
    await getLoggedInUser(ctx);

    // if the user is logged in, then redirect to {@link redirectPath}
    return {
      redirect: {
        permanent: false,
        destination: redirectPath,
      },
    };
  } catch (e) {
    const { props } = await withTranslationProps(options);

    return {
      props,
    };
  }
}
