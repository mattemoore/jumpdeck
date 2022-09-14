import { useApiRequest } from '~/core/hooks/use-api';

function useDisableMultiFactorAuthentication() {
  return useApiRequest(`/api/user/mfa/disable`, `POST`);
}

export default useDisableMultiFactorAuthentication;
