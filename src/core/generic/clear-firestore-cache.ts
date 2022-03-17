import type { Subject } from 'rxjs';

declare global {
  interface Window {
    _reactFirePreloadedObservables: Maybe<Map<string, Subject<unknown>>>;
  }
}

/**
 * Clear the Firebase cache on sign out
 * This is a workaround for a bug in ReactFire:
 * https://github.com/FirebaseExtended/reactfire/issues/485
 */
export function clearFirestoreCache() {
  const cache = window['_reactFirePreloadedObservables'];

  if (!cache) {
    return;
  }

  cache.clear();
}
