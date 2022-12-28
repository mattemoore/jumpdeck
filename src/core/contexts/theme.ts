import { createContext } from 'react';

type Theme = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}>({
  theme: null,
  setTheme: (_) => _,
});
