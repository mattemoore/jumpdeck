import React from 'react';
import { useRecoilState } from 'recoil';
import { signatureDetailsState } from '~/core/signitto/state/SignatureDetailsState';
import { signatureImageState } from '~/core/signitto/state/SignatureImageState';
import {
  type SignatureDetailModel,
  SignatureDetailType,
} from '~/core/signitto/types/SignatureDetailModel';
import * as Avatar from '@radix-ui/react-avatar';
import Divider from '~/core/ui/Divider';
import { PhoneIcon, EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

function Signature(): JSX.Element {
  const [signatureDetails] = useRecoilState(signatureDetailsState);
  const [signatureImages] = useRecoilState(signatureImageState);
  const company: string | undefined = getDetail(
    signatureDetails,
    'company'
  )?.value;

  /* TODO: Convert layout to use TABLE for better cut and pasting */
  return (
    <div className="my-10 flex flex-row space-x-4">
      <div className="flex flex-col items-center space-y-3">
        {/* TODO: Make component wrapper for Avatar as it is used here and also in SignatureLogoDetail */}
        <Avatar.Root className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-400/80">
          <Avatar.Image
            className="h-full w-full rounded-full object-cover"
            src={signatureImages[0].url}
            alt="{"
          />
          <Avatar.Fallback
            className="text-black flex h-full w-full items-center justify-center rounded-full bg-gray-400/80"
            delayMs={600}
          >
            {signatureImages[0].label}
          </Avatar.Fallback>
        </Avatar.Root>
        {company != null && (
          <div className="w-25 max-w-20 text-center font-bold text-yellow-500">
            {company}
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-1">
        {signatureDetails
          .filter((detail) => detail.value !== '')
          .map((detail, index) => {
            return (
              <div key={detail.id}>
                {index === 3 && <Divider />}

                <div key={detail.id}>
                  <div className="flex flex-row">
                    {detail.type === SignatureDetailType.Phone && (
                      <PhoneIcon className="mr-2" />
                    )}
                    {detail.type === SignatureDetailType.Email && (
                      <EnvelopeIcon className="mr-2" />
                    )}
                    {detail.type === SignatureDetailType.URL && (
                      <LinkIcon className="mr-2" />
                    )}
                    <div
                      className={classNames({
                        'font-bold': index === 0,
                        'text-normal': index < 3,
                        'text-xs': index >= 3,
                      })}
                    >
                      {detail.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function getDetail(
  details: SignatureDetailModel[],
  detailId: string
): SignatureDetailModel | undefined {
  return details.find((detail) => detail.id === detailId);
}

export default Signature;
