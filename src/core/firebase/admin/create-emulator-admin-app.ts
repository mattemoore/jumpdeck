import admin, { AppOptions } from 'firebase-admin';

/**
 * @name createEmulatorAdminApp
 * @param name
 */
export function createEmulatorAdminApp(name?: string) {
  const projectId = process.env.GCLOUD_PROJECT;
  const options: AppOptions = { projectId };

  return getOrCreateApp(name, options);
}

function getOrCreateApp(appName: string | undefined, options: AppOptions) {
  if (admin.apps.length) {
    return admin.app(appName);
  }

  return admin.initializeApp(options, appName);
}
