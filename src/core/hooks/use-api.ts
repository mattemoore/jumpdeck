import { useCallback } from 'react';
import { useRequestState } from '~/core/hooks/use-request-state';

/**
 * @name useApiRequest
 * @param path
 * @param method
 */
export function useApiRequest<Resp = unknown, Body = void>(
  path: string,
  method: HttpMethod = 'POST'
) {
  const { setError, setLoading, setData, state } = useRequestState<
    Resp,
    string
  >();

  const fn = useCallback(
    async (body: Body) => {
      setLoading(true);

      try {
        const payload = JSON.stringify(body);
        const data = await executeFetchRequest<Resp>(path, payload, method);

        setData(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : ``;

        setError(message);

        return Promise.reject(error);
      }
    },
    [path, method, setLoading, setData, setError]
  );

  return [fn, state] as [typeof fn, typeof state];
}

async function executeFetchRequest<Resp = unknown>(
  url: string,
  payload: string,
  method = 'POST'
) {
  const options: RequestInit = {
    method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
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
