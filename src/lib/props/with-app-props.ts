import { GetServerSidePropsContext } from 'next';
import { setCookie, destroyCookie, parseCookies } from 'nookies';

import configuration from '~/configuration';
import { getUserInfoById } from '~/core/firebase/admin/auth/get-user-info-by-id';
import { getLoggedInUser } from '~/core/firebase/admin/auth/get-logged-in-user';
import { initializeFirebaseAdminApp } from '~/core/firebase/admin/initialize-firebase-admin-app';

import { getCurrentOrganization } from '~/lib/server/organizations/get-current-organization';
import { withTranslationProps } from '~/lib/props/with-translation-props';
import { getUserData } from '~/lib/server/queries';

import createCsrfCookie from '~/core/generic/create-csrf-token';

const ORGANIZATION_ID_COOKIE_NAME = 'organizationId';

const DEFAULT_OPTIONS = {
  redirectPath: configuration.paths.signIn,
  locale: configuration.site.locale ?? 'en',
  localeNamespaces: <string[]>[],
  requirePlans: <string[]>[],
};

/**
 * @description A server props pipe to fetch the selected user and the organization
 * @param ctx
 * @param options
 */
export async function withAppProps(
  ctx: GetServerSidePropsContext,
  options: Partial<typeof DEFAULT_OPTIONS> = DEFAULT_OPTIONS
) {
  const mergedOptions = getAppPropsOptions(ctx.locale, options);
  const { redirectPath, requirePlans } = mergedOptions;

  try {
    await initializeFirebaseAdminApp();

    const metadata = await getUserAuthMetadata(ctx);

    // if for any reason we're not able to fetch the user's data, we redirect
    // back to the login page
    if (!metadata) {
      return redirectToLogin({
        returnUrl: ctx.resolvedUrl,
        redirectPath,
        signOut: true,
      });
    }

    const isEmailVerified = metadata.emailVerified;
    const requireEmailVerification =
      configuration.auth.requireEmailVerification;

    // when the user is not yet verified and we require email verification
    // redirect them back to the login page
    if (!isEmailVerified && requireEmailVerification) {
      return redirectToLogin({
        returnUrl: ctx.resolvedUrl,
        redirectPath,
        needsEmailVerification: true,
        signOut: true,
      });
    }

    const isOnboarded = Boolean(metadata?.customClaims?.onboarded);

    // when the user is not yet onboarded,
    // we simply redirect them back to the onboarding flow
    if (!isOnboarded) {
      return redirectToOnboarding();
    }

    // we fetch the user record from Firestore
    // which is a separate object from the auth metadata
    const user = await getUserData(metadata.uid);
    const currentOrganizationId = ctx.req.cookies[ORGANIZATION_ID_COOKIE_NAME];

    // if the user wasn't found, redirect to the onboarding
    if (!user) {
      return redirectToOnboarding();
    }

    const organization = await getCurrentOrganization(
      user.id,
      currentOrganizationId
    );

    // check if the page we're trying to access requires
    // subscription to a specific plan
    if (requirePlans?.length) {
      const plan = organization?.subscription?.priceId as string;
      const isSubscribed = requirePlans.includes(plan);

      // if the user is not subscribed to a required plan
      // we redirect back to where they came from
      if (!isSubscribed) {
        const destination =
          ctx.req.headers.referer || configuration.paths.appHome;

        return {
          redirect: {
            permanent: false,
            destination,
          },
        };
      }
    }

    // if the organization also wasn't found, redirect to the onboarding
    // so that the user can re-start its flow and create a new organization
    if (!user) {
      return redirectToOnboarding();
    }

    // if the organization is found, save the ID in a cookie
    // so that we can fetch it on the next request
    if (organization) {
      saveOrganizationInCookies(ctx, organization.id);
    }

    const csrfToken = await createCsrfCookie(ctx);

    const { props: translationProps } = await withTranslationProps(
      mergedOptions
    );

    const ui = getUiProps(ctx);

    return {
      props: {
        session: metadata,
        user,
        organization,
        csrfToken,
        ui,
        ...translationProps,
      },
    };
  } catch (e) {
    clearAuthenticationCookies(ctx);

    // if the user is signed out, we save the requested URL
    // so, we can redirect them to where they originally navigated to
    return redirectToLogin({
      returnUrl: ctx.resolvedUrl,
      redirectPath,
      signOut: true,
    });
  }
}

/**
 * @name redirectToLogin
 */
function redirectToLogin({
  returnUrl,
  redirectPath,
  needsEmailVerification,
  signOut,
}: {
  returnUrl: string;
  redirectPath: string;
  needsEmailVerification?: boolean;
  signOut: boolean;
}) {
  const cleanReturnUrl = getPathFromReturnUrl(returnUrl);

  const queryParams = new URLSearchParams({
    returnUrl: cleanReturnUrl ?? '/',
    needsEmailVerification: needsEmailVerification ? 'true' : 'false',
    signOut: signOut ? 'true' : 'false',
  });

  // we build the sign in URL
  // appending the "returnUrl" query parameter so that we can redirect the user
  // straight to where they were headed and the "signOut" parameter
  // to force the client to sign the user out from the client SDK
  const destination = `${redirectPath}?${queryParams}`;

  return {
    redirect: {
      permanent: false,
      destination,
    },
  };
}

async function getUserAuthMetadata(ctx: GetServerSidePropsContext) {
  const user = await getLoggedInUser(ctx);

  return getUserInfoById(user.uid);
}

function saveOrganizationInCookies(
  ctx: GetServerSidePropsContext,
  organizationId: string
) {
  setCookie(ctx, ORGANIZATION_ID_COOKIE_NAME, organizationId, {
    path: '/',
    httpOnly: true,
  });
}

/**
 * @name redirectToOnboarding
 */
function redirectToOnboarding() {
  const destination = configuration.paths.onboarding;

  return {
    redirect: {
      permanent: false,
      destination,
    },
  };
}

/**
 * @name clearAuthenticationCookies
 * @description When authentication fails, we clear session cookies that may
 * be stale
 * @param ctx
 */
function clearAuthenticationCookies(ctx: GetServerSidePropsContext) {
  destroyCookie(ctx, 'session');
  destroyCookie(ctx, 'sessionExpiresAt');
}

function getAppPropsOptions(
  locale: string | undefined,
  options: Partial<typeof DEFAULT_OPTIONS>
) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  return {
    ...mergedOptions,
    locale: locale ?? mergedOptions.locale,
  };
}

function getUiProps(ctx: GetServerSidePropsContext) {
  const cookies = parseCookies(ctx);
  const sidebarState = cookies['sidebarState'] ?? 'expanded';
  const theme = cookies['theme'] ?? 'light';

  return {
    sidebarState,
    theme,
  };
}

function getPathFromReturnUrl(returnUrl: string) {
  try {
    return new URL(returnUrl).pathname;
  } catch (e) {
    return returnUrl.split('?')[0];
  }
}
