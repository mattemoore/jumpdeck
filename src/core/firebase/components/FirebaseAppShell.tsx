import type { FirebaseOptions } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { FirebaseAppProvider } from 'reactfire';

export default function FirebaseAppShell({
  children,
  config,
}: React.PropsWithChildren<{
  config: FirebaseOptions;
}>) {
  const app = initializeApp(config);

  return (
    <FirebaseAppProvider firebaseApp={app}>{children}</FirebaseAppProvider>
  );
}
