import { useSentry } from '~/core/hooks/use-sentry';
import If from '~/core/ui/If';
import { isBrowser } from '~/core/generic';

const SentryBrowserWrapper: React.FC = ({ children }) => {
  // Because it uses useLayoutEffect
  // we initialize Sentry only on the client-side
  useSentry();

  return <>{children}</>;
};

const SentryProvider: React.FC = ({ children }) => {
  return (
    <If condition={isBrowser()} fallback={<>{children}</>}>
      <SentryBrowserWrapper>{children}</SentryBrowserWrapper>
    </If>
  );
};

export default SentryProvider;
