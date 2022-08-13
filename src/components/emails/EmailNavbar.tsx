import { MjmlColumn, MjmlSection, MjmlText } from 'mjml-react';
import configuration from '~/configuration';

function EmailNavbar(
  props: React.PropsWithChildren<{
    productName?: string;
  }>
) {
  const productName = props.productName ?? configuration.site.name;

  return (
    <MjmlSection fullWidth>
      <MjmlColumn>
        <MjmlText align={'center'}>
          {/* Add your logo here */}

          {productName}
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
}

export default EmailNavbar;
