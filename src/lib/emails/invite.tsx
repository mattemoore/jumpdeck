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
  organizationLogo?: string;
  inviter: Maybe<string>;
  invitedUserEmail: string;
  link: string;
  productName: string;
}

export default function renderInviteEmail(props: Props) {
  const title = `You have been invited to join ${props.organizationName}`;

  return render(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlPreview>{title}</MjmlPreview>
      </MjmlHead>

      <MjmlBody width={500}>
        <EmailNavbar />

        <MjmlSection fullWidth>
          <MjmlColumn>
            <MjmlText>Hi,</MjmlText>

            <MjmlText>
              {props.inviter} with {props.organizationName} has invited you to
              use {props.productName} to collaborate with them.
            </MjmlText>

            <MjmlText>
              Use the button below to set up your account and get started:
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection>
          <MjmlColumn>
            <CallToActionButton href={props.link}>
              Join {props.organizationName}
            </CallToActionButton>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection>
          <MjmlColumn>
            <MjmlText>Welcome aboard,</MjmlText>
            <MjmlText>The {props.productName} Team</MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>,
    { validationLevel: 'soft' }
  );
}
