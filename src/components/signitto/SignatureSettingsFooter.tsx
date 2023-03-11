import React from 'react';
import { useResetRecoilState } from 'recoil';
import { signatureDetailsState } from '~/core/signitto/state/SignatureDetailsState';
import {
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';
import Container from '~/core/ui/Container';

function SignatureSettingsFooter(): JSX.Element {
  const resetDetails = useResetRecoilState(signatureDetailsState);
  return (
    <>
      <Container>
        <div className="flex flex-row">
          <div className="flex flex-row">
            <Button color="secondary">
              <QuestionMarkCircleIcon className="float-left h-5 pr-1" />
              FAQs
            </Button>
          </div>
          {/* `flex-row-reverse` can't seem to use `space-x-???` so manually putting margin on each item */}
          <div className="flex w-full flex-row-reverse">
            <Button className="mx-3">
              <ArrowRightIcon className="float-right h-5 pr-2" />
              Continue to Social
            </Button>
            <Button color="danger" className="mx-3" onClick={resetDetails}>
              <ArrowsUpDownIcon className="float-left h-5 pr-2" />
              Reset Signature
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}

export default SignatureSettingsFooter;
