import configuration from '../configuration';
import { GoogleAnalyticsScript } from './GoogleAnalyticsScript';
import If from '~/core/ui/If';

export default function FooterScripts() {
  const accountId = configuration.firebase.measurementId;
  const production = configuration.production;

  return (
    <If condition={production && accountId}>
      <GoogleAnalyticsScript accountId={accountId as string} />
    </If>
  );
}
