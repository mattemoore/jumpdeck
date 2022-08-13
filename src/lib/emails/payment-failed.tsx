import {
  render,
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
} from 'mjml-react';

import EmailNavbar from '~/components/emails/EmailNavbar';
import CallToActionButton from '~/components/emails/CallToActionButton';

interface Props {
  organizationName: string;
  redirectUrl: string;
  value: number | null;
  productName: string;
}

export default function renderPaymentFailed(props: Props) {
  const title = `Your payment did not go through - ${props.organizationName}`;

  return render(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlPreview>{title}</MjmlPreview>
      </MjmlHead>

      <MjmlBody width={500}>
        <EmailNavbar productName={props.productName} />

        <MjmlSection fullWidth>
          <MjmlColumn>
            <MjmlText>Hi,</MjmlText>

            <MjmlText>
              We were unable to process your last payment of {props.value} for
              your {props.productName} subscription. Please take a moment to
              double-check your payment information to make sure your{' '}
              {props.productName} account keeps running smoothly.
            </MjmlText>

            <MjmlText>
              Use the button below to set up your account and get started:
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection>
          <MjmlColumn>
            <CallToActionButton href={props.redirectUrl}>
              Update your Billing Info
            </CallToActionButton>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection>
          <MjmlColumn>
            <MjmlText>Thank you,</MjmlText>
            <MjmlText>The {props.productName} Team</MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>,
    { validationLevel: 'soft' }
  );
}
