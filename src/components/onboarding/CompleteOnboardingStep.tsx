import { useCallback, useEffect } from 'react';
import { ScalingSquaresSpinner } from 'react-epic-spinners';

import { useApiRequest } from '~/core/hooks/use-api';
import Alert from '~/core/ui/Alert';

interface CompleteOnboardingStepData {
  organization: string;
}

export const CompleteOnboardingStep: React.FC<{
  onComplete: () => void;
  data: CompleteOnboardingStepData;
}> = ({ onComplete, data }) => {
  const [request, state] = useCompleteOnboardingRequest();
  const { error, success } = state;

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
    void callRequestCallback();
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
    <div className={'flex flex-1 space-x-8 items-center'}>
      <span>
        <ScalingSquaresSpinner color={'currentColor'} />
      </span>

      <span>Getting Started. Please wait...</span>
    </div>
  );
};

function useCompleteOnboardingRequest() {
  const path = '/api/onboarding';

  return useApiRequest<void, CompleteOnboardingStepData>(path);
}
