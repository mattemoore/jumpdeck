import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import configuration from '~/configuration';
import { getAuth } from 'firebase-admin/auth';

import { getUserInfoById } from '~/core/firebase/auth/get-user-info-by-id';
import { getLoggedInUser } from '~/core/firebase/auth/get-logged-in-user';
import { initializeFirebaseAdminApp } from '~/core/firebase/admin/initialize-firebase-admin-app';

import { getCurrentOrganization } from '~/lib/server/organizations/get-current-organization';
import { getUser } from '~/lib/server/organizations/get-user';
import { withTranslationProps } from '~/lib/props/with-translation-props';

const ORGANIZATION_ID_COOKIE_NAME = 'organizationId';

const DEFAULT_OPTIONS = {
  redirectPath: configuration.paths.signIn,
  locale: 'en',
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
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { redirectPath, requirePlans } = mergedOptions;

  try {
    await initializeFirebaseAdminApp();

    const metadata = await getUserAuthMetadata(ctx);

    if (!metadata) {
      return redirectToLogin(ctx.resolvedUrl, redirectPath);
    }

    const isOnboarded = Boolean(metadata?.customClaims?.onboarded);

    if (!isOnboarded) {
      return redirectToOnboarding();
    }

    // we fetch the user record from Firestore
    // which is a separate object from the auth metadata
    const user = await getUser(metadata.uid);
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
      const customClaims = metadata?.customClaims ?? {};
      const authOrganizationId = customClaims.organizationId;

      const userDidChangeOrganization =
        authOrganizationId !== currentOrganizationId;

      const shouldUpdateTokenClaims =
        !authOrganizationId || userDidChangeOrganization;

      if (shouldUpdateTokenClaims) {
        await setOrganizationIdCustomClaims(
          user.id,
          organization.id,
          customClaims
        );
      }

      saveOrganizationInCookies(ctx, organization.id);
    }

    const { props: translationProps } = await withTranslationProps(
      mergedOptions
    );

    return {
      props: {
        session: metadata,
        user,
        organization,
        ...translationProps,
      },
    };
  } catch (e) {
    console.debug(e);

    // if the user is signed out, we save the requested URL
    // so, we can redirect them to where they originally navigated to
    return redirectToLogin(ctx.resolvedUrl, redirectPath);
  }
}

/**
 * @name redirectToLogin
 * @param returnUrl
 * @param redirectPath
 */
function redirectToLogin(returnUrl: string, redirectPath: string) {
  // we build the sign in URL
  // appending the returnUrl query parameter
  // so that we can redirect the user
  // straight to where they were headed
  const destination = `${redirectPath}?returnUrl=${returnUrl}`;

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
  nookies.set(ctx, ORGANIZATION_ID_COOKIE_NAME, organizationId, { path: '/' });
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
 * @name setOrganizationIdCustomClaims
 * @param userId
 * @param organizationId
 * @param existingClaims
 * @description Updates the user's custom claims with the current
 * organization ID so that we can use the metadata to write Firebase Storage
 * Security Rules for users belonging to the organization with ID {@link organizationId}
 */
function setOrganizationIdCustomClaims(
  userId: string,
  organizationId: string,
  existingClaims: UnknownObject
) {
  const auth = getAuth();

  return auth.setCustomUserClaims(userId, {
    ...existingClaims,
    organizationId,
  });
}
