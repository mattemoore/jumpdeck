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

  /* TODO: Convert layout to use flex to see if we cut and paste works for better cut and pasting */
  return (
    <>
      <table className="Table my-10 w-1/2">
        <thead></thead>
        <tr>
          {signatureImages[0].url && (
            <td align="center" valign="top">
              <div className="pt-7">
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
            </td>
          )}
          <td>
            <table className="Table">
              {signatureDetails
                .filter((detail) => detail.value !== '')
                .map((detail, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="flex flex-row">
                          <div>
                            {detail.type === SignatureDetailType.Phone && (
                              <div className="mt-0.5 mr-2">
                                <PhoneIcon width="1em" height="1em" />
                              </div>
                            )}
                            {detail.type === SignatureDetailType.Email && (
                              <div className="mt-0.5 mr-2">
                                <EnvelopeIcon width="1em" height="1em" />
                              </div>
                            )}
                            {detail.type === SignatureDetailType.URL && (
                              <div className="mt-0.5 mr-2">
                                <LinkIcon width="1em" height="1em" />
                              </div>
                            )}
                          </div>
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
                      </td>
                    </tr>
                  );
                })}
            </table>
          </td>
        </tr>
      </table>
    </>
  );
}

function getDetail(
  details: SignatureDetailModel[],
  detailId: string
): SignatureDetailModel | undefined {
  return details.find((detail) => detail.id === detailId);
}

export default Signature;
