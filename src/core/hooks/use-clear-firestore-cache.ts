import { useCallback } from 'react';

/**
 * @name useClearFirestoreCache
 * @description This function needs to be called on sign-out to clear the
 * Firestore cache before it throws a permissions error
 * Solves: https://github.com/FirebaseExtended/reactfire/discussions/228#discussioncomment-2101193
 */
function useClearFirestoreCache() {
  return useCallback(() => {
    const reactFirePreloadedObservables = (
      globalThis as Record<string, unknown>
    )['_reactFirePreloadedObservables'] as Map<string, unknown> | undefined;

    if (reactFirePreloadedObservables) {
      Array.from(reactFirePreloadedObservables.keys())
        .filter((key) => key.includes('firestore'))
        .forEach((key) => reactFirePreloadedObservables.delete(key));
    }
  }, []);
}

export default useClearFirestoreCache;
