import { useCallback, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getCurrentOrganization } from '~/lib/server/organizations/get-current-organization';
import { getUserById } from '~/lib/server/queries';

import configuration from '~/configuration';

import { withUserProps } from '~/lib/props/with-user-props';
import Logo from '~/core/ui/Logo';
import If from '~/core/ui/If';

import { CompleteOnboardingStep } from '~/components/onboarding/CompleteOnboardingStep';

import {
  OrganizationInfoStep,
  OrganizationInfoStepData,
} from '~/components/onboarding/OrganizationInfoStep';

interface Data {
  organization: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Data>();
  const router = useRouter();

  const onFirstStepSubmitted = useCallback(
    (organizationInfo: OrganizationInfoStepData) => {
      setData({
        organization: organizationInfo.organization,
      });

      setCurrentStep(1);
    },
    []
  );

  const onComplete = useCallback(() => {
    void (async () => {
      return router.push(configuration.paths.appHome);
    })();
  }, [router]);

  return (
    <>
      <Head>
        <title key="title">Onboarding</title>
      </Head>

      <div
        className={
          'flex h-screen w-screen flex-1 flex-col items-center justify-center space-y-10 overflow-hidden bg-gray-100 dark:bg-black-500'
        }
      >
        <div>
          <Logo href={''} />
        </div>

        <div
          className={
            'flex w-11/12 rounded-xl bg-white p-10 shadow dark:bg-black-400 sm:w-8/12 md:w-6/12 xl:w-3/12'
          }
        >
          <If condition={currentStep === 0}>
            <OrganizationInfoStep onSubmit={onFirstStepSubmitted} />
          </If>

          <If condition={currentStep === 1 && data}>
            {(data) => (
              <CompleteOnboardingStep data={data} onComplete={onComplete} />
            )}
          </If>
        </div>
      </div>
    </>
  );
};

export default Onboarding;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { props } = await withUserProps(ctx);
  const user = props.session;

  if (!user) {
    return redirectToSignIn();
  }

  const userData = await getUserData(user.uid);

  // if we cannot find the user's Firestore record
  // the user should go to the onboarding flow
  // so that the record wil be created after the end of the flow
  if (!userData) {
    return {
      props,
    };
  }

  const organization = await getCurrentOrganization(user.uid);
  const { onboarded } = user.customClaims;

  // there are two cases when we redirect the user to the onboarding
  // 1. if they have not been onboarded yet
  // 2. if they end up with 0 organizations (for example, if they get removed)
  //
  // NB: you should remove this if you want to
  // allow organization-less users within the application
  if (onboarded && organization) {
    return redirectToAppHome();
  }

  return {
    props,
  };
}

function redirectToSignIn() {
  return {
    redirect: {
      destination: configuration.paths.signIn,
      permanent: false,
    },
  };
}

function redirectToAppHome() {
  return {
    redirect: {
      destination: configuration.paths.appHome,
      permanent: false,
    },
  };
}

/**
 * @name getUserData
 * @description Fetch User Firestore data decorated with its ID field
 * @param userId
 */
async function getUserData(userId: string) {
  const ref = await getUserById(userId);
  const data = ref.data();

  if (data) {
    return {
      ...data,
      id: ref.id,
    };
  }
}
