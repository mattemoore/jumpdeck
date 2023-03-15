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
      <table style={{ width: '100%' }} id="signature">
        <thead></thead>
        <tbody>
          <tr>
            {signatureImages[0].url && (
              <td align="center" valign="top">
                <div>
                  <img
                    src={signatureImages[0].url}
                    alt={signatureImages[0].label}
                  />
                </div>
                <div>
                  {company != null && (
                    <div
                      style={{
                        textAlign: 'center',
                        fontWeight: '700',
                        color: 'rgb(234 179 8 / 1)',
                      }}
                    >
                      {company}
                    </div>
                  )}
                </div>
              </td>
            )}
            <td>
              <table>
                {signatureDetails
                  .filter((detail) => detail.value !== '')
                  .map((detail, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div>
                            <div>
                              {detail.type === SignatureDetailType.Phone && (
                                <div
                                  style={{ float: 'left' }}
                                  className="mt-0.5 mr-2"
                                >
                                  <PhoneIcon width="1em" height="1em" />
                                </div>
                              )}
                              {detail.type === SignatureDetailType.Email && (
                                <div
                                  style={{ float: 'left' }}
                                  className="mt-0.5 mr-2"
                                >
                                  <EnvelopeIcon width="1em" height="1em" />
                                </div>
                              )}
                              {detail.type === SignatureDetailType.URL && (
                                <div
                                  style={{ float: 'left' }}
                                  className="mt-0.5 mr-2"
                                >
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
        </tbody>
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
