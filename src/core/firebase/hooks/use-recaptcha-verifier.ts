import { RecaptchaVerifier } from 'firebase/auth';
import { useAuth } from 'reactfire';
import { useCallback } from 'react';

function useRecaptchaVerifier(id: string) {
  const auth = useAuth();

  return useCallback(() => {
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
