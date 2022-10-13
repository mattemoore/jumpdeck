import { createContext } from 'react';

export const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (open: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: (_) => _,
});
