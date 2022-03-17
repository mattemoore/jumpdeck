const REDIRECT_URL_QUERY_PARAM = 'returnUrl';

/**
 * @name getRedirectPathWithoutSearchParam
 * @param defaultRedirectPath
 * @param searchParamName
 * @description given a URL with a searchParam "returnUrl"
 * this functions return the URL without this parameter
 */
export function getRedirectPathWithoutSearchParam(
  defaultRedirectPath: string,
  searchParamName = REDIRECT_URL_QUERY_PARAM
) {
  const returnUrl = getReturnUrlFromSearchParams(searchParamName);

  if (!returnUrl) {
    return defaultRedirectPath;
  }

  const params = getUrlParams();
  const hasParams = Array.from(params.values()).length - 1 > 0;

  params.delete(searchParamName);

  // redirect to the URL passed in from the search params
  return [returnUrl, hasParams ? `?${params.toString()}` : ''].join('/');
}

function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

function getReturnUrlFromSearchParams(searchParamName: string) {
  return getUrlParams().get(searchParamName);
}
