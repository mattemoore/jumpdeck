import admin from 'firebase-admin';

import { FirebaseAdminAppParams } from '../types/firebase-admin-app-params';
import formatFirebasePrivateKey from './format-private-key';

/**
 * @name createFirebaseAdminApp
 * @param params
 */
export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatFirebasePrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    return admin.app();
  }

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
