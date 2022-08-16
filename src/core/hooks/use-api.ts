import { useCallback, useContext } from 'react';
import { AppCheckSdkContext, useAppCheck } from 'reactfire';
import { getToken } from 'firebase/app-check';
import { useRequestState } from '~/core/hooks/use-request-state';

/**
 * @name useApiRequest
 * @param path
 * @param method
 * @param headers
 */
export function useApiRequest<Resp = unknown, Body = void>(
  path: string,
  method: HttpMethod = 'POST',
  headers?: StringObject
) {
  const { setError, setLoading, setData, state } = useRequestState<
    Resp,
    string
  >();

  const getAppCheckToken = useGetAppCheckToken();

  const fn = useCallback(
    async (body: Body) => {
      setLoading(true);

      try {
        const payload = JSON.stringify(body);
        const token = await getAppCheckToken();

        // if the app-check token was found
        // we add the header to the API request
        if (token) {
          if (!headers) {
            headers = {};
          }

          headers['X-Firebase-AppCheck'] = token;
        }

        const data = await executeFetchRequest<Resp>(
          path,
          payload,
          method,
          headers
        );

        setData(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : `Unknown error`;

        setError(message);

        return Promise.reject(error);
      }
    },
    [setLoading, getAppCheckToken, path, method, headers, setData, setError]
  );

  return [fn, state] as [typeof fn, typeof state];
}

async function executeFetchRequest<Resp = unknown>(
  url: string,
  payload: string,
  method = 'POST',
  headers?: StringObject
) {
  const options: RequestInit = {
    method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
  };

  const methodsSupportingBody: HttpMethod[] = ['POST', 'PUT'];
  const supportsBody = methodsSupportingBody.includes(method as HttpMethod);

  if (payload && supportsBody) {
    options.body = payload;
  }

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      return (await response.json()) as Promise<Resp>;
    }

    return Promise.reject(response.statusText);
  } catch (e) {
    return Promise.reject(e);
  }
}

function useGetAppCheckToken() {
  // instead of using useAppCheck()
  // we manually request the SDK
  // because we *may not have initialized it*
  const sdk = useContext(AppCheckSdkContext);

  return useCallback(async () => {
    try {
      // if the SDK does not exist, we cannot generate a token
      if (!sdk) {
        return;
      }

      const forceRefresh = false;
      const { token } = await getToken(sdk, forceRefresh);

      return token;
    } catch (e) {
      return;
    }
  }, [sdk]);
}
