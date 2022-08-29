import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import toaster from 'react-hot-toast';
import { useTranslation, Trans } from 'next-i18next';

import type { User } from 'firebase/auth';
import { useAuth, useSigninCheck } from 'reactfire';

import configuration from '~/configuration';
import { isBrowser } from '~/core/generic';

import { withUserProps } from '~/lib/props/with-user-props';
import Logo from '~/core/ui/Logo';
import Hero from '~/core/ui/Hero';
import Layout from '~/core/ui/Layout';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

import { useApiRequest } from '~/core/hooks/use-api';
import logger from '~/core/logger';

import { initializeFirebaseAdminApp } from '~/core/firebase/admin/initialize-firebase-admin-app';
import OAuthProviders from '~/components/auth/OAuthProviders';
import EmailPasswordSignUpForm from '~/components/auth/EmailPasswordSignUpForm';
import GuardedPage from '~/core/firebase/components/GuardedPage';
import EmailPasswordSignInForm from '~/components/auth/EmailPasswordSignInForm';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

import { getInviteByCode } from '~/lib/server/organizations/get-invite-by-code';
import { getUserRoleByOrganization } from '~/lib/server/organizations/get-user-role-by-organization';

enum Mode {
  SignUp,
  SignIn,
}

interface Invite {
  code: string;

  organization: {
    id: string;
    name: string;
  };
}

const InvitePage = (
  props: PropsWithChildren<{
    session: Maybe<User>;
    invite: Invite;
  }>
) => {
  const auth = useAuth();
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState(props.session);
  const signInCheck = useSigninCheck();
  const { t } = useTranslation('organization');
  const invite = props.invite;

  const organization = invite.organization;
  const redirectOnSignOut = getRedirectPath();
  const [mode, setMode] = useState<Mode>(Mode.SignUp);

  const [addMemberToOrganization, requestState] = useAddMemberToOrganization(
    organization.id
  );

  const redirectToHomePage = useCallback(() => {
    const homePage = configuration.paths.appHome;

    return router.push(homePage);
  }, [router]);

  const onInviteAccepted = useCallback(() => {
    const body = { code: invite.code };
    const promise = addMemberToOrganization(body);

    return toaster.promise(promise, {
      loading: t('auth:acceptingInvite'),
      success: t('auth:acceptInviteSuccess'),
      error: t('auth:acceptInviteError'),
    });
  }, [addMemberToOrganization, invite.code]);

  useEffect(() => {
    if (signInCheck.status === 'success' && !signInCheck.data.signedIn) {
      setCurrentSession(undefined);
    }
  }, [signInCheck]);

  useEffect(() => {
    if (requestState.success) {
      void redirectToHomePage();
    }
  }, [redirectToHomePage, requestState.success]);

  if (requestState.loading) {
    return (
      <PageLoadingIndicator>
        <Trans
          i18nKey={'auth:addingToOrganization'}
          values={{ name: organization.name }}
          components={{ b: <b /> }}
        />
      </PageLoadingIndicator>
    );
  }

  return (
    <Layout>
      <Head>
        <title key={'title'}>
          {`You have been invited to join ${organization.name}`}
        </title>
      </Head>

      <div className={'flex h-screen flex-col items-center justify-center'}>
        <div
          className={
            'flex w-11/12 flex-col items-center space-y-8 md:w-8/12 lg:w-4/12 xl:w-3/12'
          }
        >
          <div>
            <Logo />
          </div>

          <Hero>
            <span className={'flex text-center'}>
              <Trans
                i18nKey={'auth:joinOrganizationHeading'}
                values={{
                  organization: invite.organization.name,
                }}
              />
            </span>
          </Hero>

          <div>
            <p className={'text-center'}>
              <Trans
                i18nKey={'auth:joinOrganizationSubHeading'}
                values={{
                  organization: invite.organization.name,
                }}
                components={{ b: <b /> }}
              />
            </p>

            <p className={'text-center'}>
              <If condition={!currentSession}>
                <Trans i18nKey={'auth:signUpToAcceptInvite'} />
              </If>
            </p>
          </div>

          {/* FLOW FOR AUTHENTICATED USERS */}
          <If condition={currentSession}>
            <GuardedPage whenSignedOut={redirectOnSignOut}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  return onInviteAccepted();
                }}
                className={'flex flex-col space-y-8'}
              >
                <p className={'text-center text-sm'}>
                  <Trans
                    i18nKey={'auth:clickToAcceptAs'}
                    values={{ email: currentSession?.email }}
                    components={{ b: <b /> }}
                  />
                </p>

                <Button data-cy={'accept-invite-submit-button'} type={'submit'}>
                  <Trans i18nKey={'auth:acceptInvite'} />
                </Button>

                <div>
                  <p
                    className={
                      'text-center text-sm text-gray-700 dark:text-gray-300'
                    }
                  >
                    <Trans i18nKey={'auth:acceptInviteWithDifferentAccount'} />

                    <Button
                      block
                      color={'transparent'}
                      className="underline"
                      size={'small'}
                      disabled={requestState.loading}
                      onClick={() => auth.signOut()}
                      type={'button'}
                    >
                      <Trans i18nKey={'auth:signOut'} />
                    </Button>
                  </p>
                </div>
              </form>
            </GuardedPage>
          </If>

          {/* FLOW FOR NEW USERS */}
          <If condition={!currentSession}>
            <OAuthProviders onSuccess={onInviteAccepted} />

            <div className={'text-sm text-gray-400'}>
              <Trans i18nKey={'auth:orContinueWithEmail'} />
            </div>

            <If condition={mode === Mode.SignUp}>
              <div className={'flex w-full flex-col items-center space-y-8'}>
                <EmailPasswordSignUpForm onSignUp={onInviteAccepted} />

                <Button
                  block
                  color={'transparent'}
                  size={'small'}
                  onClick={() => setMode(Mode.SignIn)}
                >
                  <Trans i18nKey={'auth:alreadyHaveAccountStatement'} />
                </Button>
              </div>
            </If>

            <If condition={mode === Mode.SignIn}>
              <div className={'flex w-full flex-col items-center space-y-8'}>
                <EmailPasswordSignInForm onSignIn={onInviteAccepted} />

                <Button
                  block
                  color={'transparent'}
                  size={'small'}
                  onClick={() => setMode(Mode.SignUp)}
                >
                  <Trans i18nKey={'auth:doNotHaveAccountStatement'} />
                </Button>
              </div>
            </If>
          </If>
        </div>
      </div>
    </Layout>
  );
};

export default InvitePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // we need to create the admin app before
  // we can use Firestore on the server-side
  await initializeFirebaseAdminApp();

  const { props } = await withUserProps(ctx);
  const userId = props.session?.uid;
  const code = ctx.params?.code as Maybe<string>;

  // if the code wasn't provided we cannot continue
  // so, we redirect to 404
  if (!code) {
    return notFound();
  }

  try {
    const invite = await getInviteByCode(code);

    // if the invite wasn't found, it's 404
    if (!invite) {
      logger.warn(
        {
          code,
        },
        `User navigated to invite page, but it wasn't found. Redirecting to home page...`
      );

      return notFound();
    }

    const organizationId = invite.organization.id;

    // We check if the user is already part of the organization
    if (userId) {
      const userRole = await getUserRoleByOrganization({
        organizationId,
        userId,
      });

      const isPartOfOrganization = userRole !== undefined;

      // if yes, we redirect the user to the error page
      if (isPartOfOrganization) {
        return redirectToErrorPage();
      }
    }

    return {
      props: {
        ...props,
        invite,
      },
    };
  } catch (e) {
    logger.debug(e);

    logger.error(
      `Error encountered while fetching invite. Redirecting to home page...`
    );

    return redirectToHomePage();
  }
}

function redirectToHomePage() {
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
}

function redirectToErrorPage() {
  return {
    redirect: {
      permanent: false,
      destination: '/500',
    },
  };
}

function useAddMemberToOrganization(id: string) {
  const path = `/api/organizations/${id}/members`;

  return useApiRequest<
    void,
    {
      code: string;
    }
  >(path);
}

function getRedirectPath() {
  return isBrowser() ? window.location.pathname : undefined;
}

function notFound() {
  return {
    notFound: true,
  };
}
