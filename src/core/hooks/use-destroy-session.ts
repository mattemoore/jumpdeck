import { useApiRequest } from '~/core/hooks/use-api';

export function useDestroySession() {
  const [request] = useApiRequest('/api/session/sign-out');

  return request;
}
