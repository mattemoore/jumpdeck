import { useApiRequest } from '~/core/hooks/use-api';

interface Body {
  idToken: string;
}

export function useCreateSession() {
  return useApiRequest<void, Body>('/api/session/sign-in');
}
