import React from 'react';
import { useResetRecoilState } from 'recoil';
import { signatureDetailsState } from '~/core/signitto/state/SignatureDetailsState';
import {
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';
import Container from '~/core/ui/Container';

function SignatureSettingsFooter(): JSX.Element {
  const resetDetails = useResetRecoilState(signatureDetailsState);
  return (
    <>
      <div className="flex flex-row bg-primary-50 px-5 py-3">
        <div className="flex flex-row">
          <Button size="small">
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
            <ArrowUturnLeftIcon className="float-left h-5 pr-2" />
            Reset Signature
          </Button>
        </div>
      </div>
    </>
  );
}

export default SignatureSettingsFooter;
