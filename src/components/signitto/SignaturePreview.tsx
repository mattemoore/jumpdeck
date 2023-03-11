import React from 'react';
import Signature from './Signature';
import { EyeIcon } from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';

function SignaturePreview(): JSX.Element {
  return (
    <>
      <div className="m-10 flex h-3/4 w-3/4 flex-col">
        <div className="flex flex-row justify-center space-x-4 p-4">
          <div className="PillHeader">
            <EyeIcon className="float-left mr-2 h-5" />
            Preview
          </div>
        </div>
        <div
          id="emailWindow"
          className="border-gray/10 m-4 rounded-md border shadow-lg"
        >
          <div className="flex h-8 w-full flex-row items-center space-x-1.5 rounded-t-md bg-neutral-700 p-3">
            <div className="h-3 w-3 rounded-full bg-gray-200" />
            <div className="h-3 w-3 rounded-full bg-gray-200" />
            <div className="h-3 w-3 rounded-full bg-gray-200" />
          </div>
          <div className="mx-6">
            <div className="border-gray/10 flex flex-row items-center space-x-3 border-b py-3">
              <div>To:</div>
              <div className="border-gray/10 rounded-full border bg-slate-100 px-3 py-1">
                Elizabeth Gillis
              </div>
            </div>
            <div className="border-gray/10 flex flex-row items-center space-x-3 border-b py-3">
              <div>Let&apos;s do lunch today!</div>
            </div>
            <h3 className="mt-5 h-2 w-1/4 rounded-md bg-gray-200 dark:bg-gray-700" />
            <ul className="mt-5 space-y-3">
              <li className="h-2 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
              <li className="h-2 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            </ul>
            <Signature></Signature>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <Button>Create Signature</Button>
        </div>
      </div>
    </>
  );
}
export default SignaturePreview;
