import { useCallback, useEffect, useRef } from 'react';
import { SpringSpinner } from 'react-epic-spinners';

import { useApiRequest } from '~/core/hooks/use-api';
import Alert from '~/core/ui/Alert';

interface CompleteOnboardingStepData {
  organization: string;
}

export const CompleteOnboardingStep: React.FCC<{
  onComplete: () => void;
  data: CompleteOnboardingStepData;
}> = ({ onComplete, data }) => {
  const [request, state] = useCompleteOnboardingRequest();
  const { error, success } = state;
  const onboardingCompleteRequested = useRef(false);

  const callRequestCallback = useCallback(() => {
    if (data) {
      return request(data);
    }
  }, [request, data]);

  const callOnCompleteCallback = useCallback(() => {
    if (success) {
      onComplete();
    }
  }, [success, onComplete]);

  useEffect(() => {
    // React will run the effect twice
    // so we use the ref to prevent it
    if (!onboardingCompleteRequested.current) {
      onboardingCompleteRequested.current = true;
      void callRequestCallback();
    }
  }, [callRequestCallback]);

  useEffect(callOnCompleteCallback, [callOnCompleteCallback]);

  if (error) {
    return (
      <div className={'flex flex-col space-y-4'}>
        <Alert type={'error'}>{error}</Alert>
      </div>
    );
  }

  return (
    <div className={'flex flex-1 items-center space-x-8'}>
      <span>
        <SpringSpinner size={36} color={'currentColor'} />
      </span>

      <span>Getting Started. Please wait...</span>
    </div>
  );
};

function useCompleteOnboardingRequest() {
  const path = '/api/onboarding';

  return useApiRequest<void, CompleteOnboardingStepData>(path);
}
