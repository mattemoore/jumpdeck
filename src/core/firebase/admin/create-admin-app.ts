import { FirebaseAdminAppParams } from '../types/firebase-admin-app-params';

/**
 * @name createFirebaseAdminApp
 * @param params
 */
export async function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const { getApps, getApp, cert, initializeApp } = await import(
    'firebase-admin/app'
  );

  if (getApps().length > 0) {
    return getApp();
  }

  const privateKey = formatFirebasePrivateKey(params.privateKey);

  const credential = cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return initializeApp({
    credential,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

function formatFirebasePrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}
