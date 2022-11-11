import React from "react";
import { useCsrfToken } from "~/core/firebase/hooks/use-csrf-token";

function CSRFTokenInput() {
  const token = useCsrfToken();

  return (
    <input
      type="hidden"
      name={'csrfToken'}
      defaultValue={token ?? ''}
    />
  );
}

export default CSRFTokenInput;
