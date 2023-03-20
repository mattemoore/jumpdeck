import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { signatureDetailsState } from '~/core/signitto/state/SignatureDetailsState';
import { signatureImageState } from '~/core/signitto/state/SignatureImageState';
import {
  type SignatureDetailModel,
  SignatureDetailType,
} from '~/core/signitto/types/SignatureDetailModel';
import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import * as clipboard from 'clipboard-polyfill';

function Signature(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [signatureDetails] = useRecoilState(signatureDetailsState);
  const [signatureImages] = useRecoilState(signatureImageState);
  const company: string | undefined = getDetail(
    signatureDetails,
    'company'
  )?.value;
  const signatureRef = React.createRef<HTMLDivElement>();

  function copySignatureToClipboard() {
    const signatureElem: HTMLDivElement | null = signatureRef.current;
    if (signatureElem != null) {
      const item = new clipboard.ClipboardItem({
        'text/html': new Blob([signatureElem.outerHTML], {
          type: 'text/html',
        }),
        'text/plain': new Blob([signatureElem.outerHTML], {
          type: 'text/plain',
        }),
      });
      clipboard.write([item]);
      setIsOpen(true);
    }
  }

  return (
    <>
      <div ref={signatureRef}>
        <table style={{ width: '100%' }}>
          <thead></thead>
          <tbody>
            <tr>
              {signatureImages[0].url && (
                <td style={{ padding: '0px' }} align="center" valign="top">
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
                <table style={{ width: '100%' }}>
                  <thead></thead>
                  <tbody>
                    {signatureDetails
                      .filter((detail) => detail.value !== '')
                      .map((detail, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div>
                                <div>
                                  {detail.type ===
                                    SignatureDetailType.Phone && (
                                    <div
                                      style={{
                                        float: 'left',
                                        marginTop: '0.125rem',
                                        marginRight: '0.5rem',
                                        width: '1em',
                                      }}
                                    >
                                      <img
                                        src="/assets/images/phone.png"
                                        alt="Phone icon"
                                      />
                                    </div>
                                  )}
                                  {detail.type ===
                                    SignatureDetailType.Email && (
                                    <div
                                      style={{
                                        float: 'left',
                                        marginTop: '0.125rem',
                                        marginRight: '0.5rem',
                                        width: '1em',
                                      }}
                                    >
                                      <img
                                        src="/assets/images/envelope.png"
                                        alt="Envelope icon"
                                      />
                                    </div>
                                  )}
                                  {detail.type === SignatureDetailType.URL && (
                                    <div
                                      style={{
                                        float: 'left',
                                        marginTop: '0.125rem',
                                        marginRight: '0.5rem',
                                        width: '1em',
                                      }}
                                    >
                                      <img
                                        src="/assets/images/link.png"
                                        alt="Link icon"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div
                                  style={{
                                    fontWeight: index === 0 ? '700' : '500',
                                    fontSize: index > 2 ? 'small' : 'medium',
                                  }}
                                >
                                  {detail.value}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-center">
        <Button onClick={copySignatureToClipboard}>Create Signature</Button>
        <Modal
          heading="Signature generated"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <div className={'flex flex-col space-y-4'}>
            <p>
              You signature has been copied to the clipboard. You may now paste
              your signature into your email provider&apos;s signature setting.
            </p>

            <div className={'flex justify-end space-x-2'}>
              <Button variant={'flat'} onClick={() => setIsOpen(false)}>
                Continue
              </Button>
            </div>
          </div>
        </Modal>
      </div>
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
