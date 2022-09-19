import { useAuth } from 'reactfire';
import { useCallback } from 'react';

function useRecaptchaVerifier(id: string) {
  const auth = useAuth();

  return useCallback(async () => {
    const { RecaptchaVerifier } = await import('firebase/auth');

    return new RecaptchaVerifier(
      id,
      {
        size: 'invisible',
      },
      auth
    );
  }, [auth, id]);
}

export default useRecaptchaVerifier;
