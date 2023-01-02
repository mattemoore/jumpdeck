import { useCallback, useContext, useRef } from 'react';
import { AppCheckSdkContext } from 'reactfire';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';

const FIREBASE_APP_CHECK_HEADER = 'X-Firebase-AppCheck';
const CSRF_TOKEN_HEADER = 'x-csrf-token';

/**
 * @name useApiRequest
 * @description A hook to make API requests
 * 1. By default, it will use the `POST` method and will send the payload as
 * JSON
 * 2. Also, it will automatically add the CSRF token to the request headers and
 * the App Check token if the SDK is initialized
 */
export function useApiRequest<Resp = unknown, Body = void>() {
  const headersRef = useRef<StringObject>({});
  const getSecurityHeaders = useGetSecurityHeaders();

  return useCallback(
    async (params: {
      path: string;
      body?: Body;
      method?: HttpMethod;
      headers?: StringObject;
    }) => {
      const securityHeaders = await getSecurityHeaders();
      const payload = JSON.stringify(params.body);

      // initialize the headers if they are not defined
      if (!headersRef.current) {
        headersRef.current = params.headers ?? {};
      }

      // add the AppCheck token to the request headers if it exists
      if (securityHeaders.appCheckToken) {
        headersRef.current[FIREBASE_APP_CHECK_HEADER] =
          securityHeaders.appCheckToken;
      }

      // add the CSRF token to the request headers if it exists
      if (securityHeaders.csrfToken) {
        headersRef.current[CSRF_TOKEN_HEADER] = securityHeaders.csrfToken;
      }

      // execute the fetch request
      return executeFetchRequest<Resp>(
        params.path,
        payload,
        params.method,
        headersRef.current
      );
    },
    [getSecurityHeaders]
  );
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

    return Promise.reject(await response.json());
  } catch (error) {
    return Promise.reject(error);
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
      // so we return undefined
      if (!sdk) {
        return;
      }

      const forceRefresh = false;
      const { getToken } = await import('firebase/app-check');
      const { token } = await getToken(sdk, forceRefresh);

      return token;
    } catch (e) {
      return;
    }
  }, [sdk]);
}

function useGetSecurityHeaders() {
  const csrfToken = useCsrfToken();
  const getAppCheckToken = useGetAppCheckToken();

  return useCallback(async () => {
    const appCheckToken = await getAppCheckToken();

    return {
      csrfToken,
      appCheckToken,
    };
  }, [csrfToken, getAppCheckToken]);
}
