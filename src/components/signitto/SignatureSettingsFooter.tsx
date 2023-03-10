import React from 'react';
import { useResetRecoilState } from 'recoil';
import { signatureDetailsState } from '~/core/signitto/state/SignatureDetailsState';
import {
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

function SignatureSettingsFooter(): JSX.Element {
  const resetDetails = useResetRecoilState(signatureDetailsState);
  return (
    <>
      <div className="flow-root px-6 py-2">
        <button className="border-gray/10 float-left h-10 rounded-md border px-4 text-sm font-normal hover:scale-110 hover:bg-slate-100">
          <QuestionMarkCircleIcon className="float-left pr-1" />
          FAQs
        </button>
        <div>
          <button className="border-gray/10 float-right mx-4 h-10 rounded-md border px-4 text-sm font-normal hover:scale-110 hover:bg-slate-100">
            <ArrowRightIcon className="float-right pl-2" />
            Continue to Social
          </button>
          <button
            onClick={resetDetails}
            className="border-gray/10 float-right mx-4 h-10 rounded-md border bg-red-200/90 px-4 text-sm font-normal text-red-800 hover:scale-110 hover:bg-slate-100"
          >
            <ArrowsUpDownIcon className="float-left pr-2" />
            Reset Signature
          </button>
        </div>
      </div>
    </>
  );
}

export default SignatureSettingsFooter;
