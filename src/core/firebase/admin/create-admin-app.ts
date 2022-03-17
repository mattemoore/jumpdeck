import { FirebaseAdminAppParams } from '../types/firebase-admin-app-params';
import formatFirebasePrivateKey from './format-private-key';

/**
 * @name createFirebaseAdminApp
 * @param params
 */
export async function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const admin = await import('firebase-admin');
  const privateKey = formatFirebasePrivateKey(params.privateKey);

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}
