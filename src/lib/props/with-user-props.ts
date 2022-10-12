import { GetServerSidePropsContext } from 'next';

import { getUserInfoById } from '~/core/firebase/admin/auth/get-user-info-by-id';
import { getLoggedInUser } from '~/core/firebase/admin/auth/get-logged-in-user';
import { withTranslationProps } from '~/lib/props/with-translation-props';
import createCsrfToken from '~/core/generic/create-csrf-token';

/**
 * @description A server props pipe to fetch the selected user without requiring an organization
 * @param ctx
 */
export async function withUserProps(ctx: GetServerSidePropsContext) {
  const { props } = await withTranslationProps({ locale: ctx.locale });

  try {
    const { uid } = await getLoggedInUser(ctx);
    const session = uid ? await getUserInfoById(uid) : null;
    const csrfToken = await createCsrfToken(ctx);

    return {
      props: {
        session,
        csrfToken,
        ...props,
      },
    };
  } catch (e) {
    return {
      props: {
        ...props,
        session: null,
        user: null,
      },
    };
  }
}
