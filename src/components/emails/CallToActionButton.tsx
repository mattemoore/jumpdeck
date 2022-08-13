import { MjmlButton } from 'mjml-react';

// update this with your brand's primary color
const PRIMARY_COLOR = `#3b82f6`;

function CallToActionButton(
  props: React.PropsWithChildren<{
    href: string;
  }>
) {
  return (
    <MjmlButton
      padding="12px"
      backgroundColor={PRIMARY_COLOR}
      borderRadius={'8px'}
      href={props.href}
    >
      {props.children}
    </MjmlButton>
  );
}

export default CallToActionButton;
