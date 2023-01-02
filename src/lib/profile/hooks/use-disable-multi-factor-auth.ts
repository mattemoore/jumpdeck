import useSWRMutation from 'swr/mutation';
import { useApiRequest } from '~/core/hooks/use-api';

function useDisableMultiFactorAuthentication() {
  const endpoint = '/api/user/mfa/disable';
  const fetcher = useApiRequest();

  return useSWRMutation(endpoint, (path) => {
    return fetcher({
      path,
    });
  });
}

export default useDisableMultiFactorAuthentication;
