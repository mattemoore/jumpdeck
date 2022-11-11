import { createContext } from 'react';

export const CsrfTokenContext = createContext<Maybe<string>>(undefined);
