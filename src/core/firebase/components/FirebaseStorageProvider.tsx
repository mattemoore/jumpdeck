import React from 'react';
import configuration from '~/configuration';

import type { FirebaseStorage } from 'firebase/storage';
import { StorageProvider, useInitStorage } from 'reactfire';

export default function FirebaseStorageProvider({
  children,
  useEmulator,
}: React.PropsWithChildren<{ useEmulator?: boolean }>) {
  const emulator = useEmulator ?? configuration.emulator;

  const { data: sdk, status } = useInitStorage(async (app) => {
    const bucketUrl = configuration.firebase.storageBucket;
    const { getStorage } = await import('firebase/storage');
    const storage = getStorage(app, bucketUrl);

    if (emulator) {
      await connectToEmulator(storage);
    }

    return storage;
  });

  const loading = status === 'loading';

  // while loading, we display an indicator
  // this will avoid issue where the SDK was not initialized
  // when using the Storage SDK by calling useStorage()
  // NB: it also means SSR won't work for children of this provider
  if (loading) {
    return null;
  }

  return <StorageProvider sdk={sdk}>{children}</StorageProvider>;
}

async function connectToEmulator(storage: FirebaseStorage) {
  const { connectStorageEmulator } = await import('firebase/storage');

  const port = 9199;
  const emulatorHost = configuration.emulatorHost ?? 'localhost';

  connectStorageEmulator(storage, emulatorHost, port);
}
