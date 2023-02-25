import { useEffect, useRef } from 'react';
import useSWRMutation from 'swr/mutation';

import { useApiRequest } from '~/core/hooks/use-api';
import Alert from '~/core/ui/Alert';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

interface CompleteOnboardingStepData {
  organization: string;
}

export const CompleteOnboardingStep: React.FCC<{
  onComplete: () => void;
  data: CompleteOnboardingStepData;
}> = ({ onComplete, data }) => {
  const { trigger, error } = useCompleteOnboardingRequest();
  const onboardingCompleteRequested = useRef(false);

  useEffect(() => {
    void (async () => {
      // React will run the effect twice
      // so we use the ref to prevent it
      if (!onboardingCompleteRequested.current) {
        onboardingCompleteRequested.current = true;
        await trigger(data);

        onComplete();
      }
    })();
  }, [data, onComplete, trigger]);

  if (error) {
    return (
      <div className={'flex flex-col space-y-4'}>
        <Alert type={'error'}>{error}</Alert>
      </div>
    );
  }

  return (
    <div className={'flex flex-1 flex-col items-center space-y-8'}>
      <PageLoadingIndicator fullPage={false} displayLogo={false}>
        <span>Getting Started. Please wait...</span>
      </PageLoadingIndicator>
    </div>
  );
};

function useCompleteOnboardingRequest() {
  const fetcher = useApiRequest<void, CompleteOnboardingStepData>();

  return useSWRMutation(
    '/api/onboarding',
    (path, { arg: body }: { arg: CompleteOnboardingStepData }) => {
      return fetcher({
        path,
        body,
      });
    }
  );
}
