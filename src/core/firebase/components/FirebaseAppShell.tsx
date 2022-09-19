import type { FirebaseOptions } from 'firebase/app';
import { FirebaseAppProvider } from 'reactfire';

function FirebaseAppShell({
  children,
  config,
}: React.PropsWithChildren<{
  config: FirebaseOptions;
}>) {
  return (
    <FirebaseAppProvider firebaseConfig={config}>
      {children}
    </FirebaseAppProvider>
  );
}

export default FirebaseAppShell;
