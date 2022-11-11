import { useContext } from "react";
import { CsrfTokenContext } from "~/core/contexts/csrf-token";

/**
 * @description Retrieves the current CSRF token in the page
 */
export function useCsrfToken() {
  return useContext(CsrfTokenContext);
}
