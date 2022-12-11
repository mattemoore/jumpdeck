import { Trans } from 'next-i18next';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useUser } from 'reactfire';

import Alert from '~/core/ui/Alert';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import EnrolMultiFactorAuthContainer from '~/components/profile/mfa/EnrolMultiFactorAuthContainer';
import EmailVerificationAlert from '~/components/profile/mfa/EmailVerificationAlert';

const MultiFactorAuthSetupContainer: React.FC<{
  onComplete: (success: boolean) => void;
}> = ({ onComplete }) => {
  const [enableMFAVisible, setEnableMFAVisible] = useState(false);
  const { data: user, status } = useUser();

  if (!user || status === `loading`) {
    return null;
  }

  const isEmailVerified = user.emailVerified;

  return (
    <>
      <div className={'flex flex-col space-y-4'}>
        <Alert type={'info'}>
          <Alert.Heading>
            <Trans i18nKey={'profile:multiFactorAuthHeading'} />
          </Alert.Heading>

          <p>
            <Trans i18nKey={'profile:multiFactorAuthDescription'} />
          </p>
        </Alert>

        <If condition={isEmailVerified}>
          <div>
            <EnableMFAButton onClick={() => setEnableMFAVisible(true)} />
          </div>
        </If>

        <If
          condition={isEmailVerified}
          fallback={<EmailVerificationAlert user={user} />}
        >
          <If condition={enableMFAVisible}>
            <EnrolMultiFactorAuthContainer
              onComplete={(success) => {
                onComplete(success);
                setEnableMFAVisible(false);
              }}
            />
          </If>
        </If>
      </div>
    </>
  );
};

function EnableMFAButton(
  props: React.PropsWithChildren<{ onClick: EmptyCallback }>
) {
  return (
    <Button color={'primary'} onClick={props.onClick}>
      <span className={'flex space-x-2'}>
        <ShieldCheckIcon className={'h-5'} />

        <span>
          <Trans i18nKey={'profile:setupMfaButtonLabel'} />
        </span>
      </span>
    </Button>
  );
}

export default MultiFactorAuthSetupContainer;
