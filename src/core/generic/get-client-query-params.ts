/**
 * @name getClientQueryParams
 * @description Get the query params from the client
 */
function getClientQueryParams() {
  return new URLSearchParams(window.location.search);
}

export default getClientQueryParams;
