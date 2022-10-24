import { IncomingHttpHeaders } from 'http';
import { URL } from 'url';

/**
 * @description get the path from which an API handler is being called,
 * without taking into account the hostname
 *
 * For example, if https://localhost:3000/my/page is calling an API handler, the
 * function with return /my/page. This is useful to redirect the user back from
 * where they came from, for example in case of errors.
 * @param headers
 * @param defaultPath
 */
export function getApiRefererPath(
  headers: IncomingHttpHeaders,
  defaultPath = '/'
) {
  const fullPath = headers.referer || headers.origin;

  if (!fullPath) {
    return defaultPath;
  }

  const url = new URL(fullPath);

  return url.pathname;
}
