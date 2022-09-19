import configuration from '~/configuration';

/**
 * @description Initializes the firebase Admin app.
 * If emulator=true, will start the emulator admin
 */
export async function initializeFirebaseAdminApp() {
  const emulator = configuration.emulator;

  if (emulator) {
    const { createEmulatorAdminApp } = await import(
      './create-emulator-admin-app'
    );

    return createEmulatorAdminApp();
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const projectId = configuration.firebase.projectId;
  const storageBucket = configuration.firebase.storageBucket;

  // assert all values have been provided
  if (!projectId || !privateKey || !clientEmail || !storageBucket) {
    throw new Error(
      `Cannot create Firebase Admin App. Please provide all the required parameters`
    );
  }

  const { createFirebaseAdminApp } = await import('./create-admin-app');

  return createFirebaseAdminApp({
    projectId,
    storageBucket,
    clientEmail,
    privateKey,
  });
}
