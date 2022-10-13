import { useCallback, useState } from 'react';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'sidebarCollapsed';

function useCollapsible() {
  const [isCollapsed, setIsCollapsed] = useState(
    getCollapsibleStateFromStorage()
  );

  const onCollapseChange = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
    storeCollapsibleState(collapsed);
  }, []);

  return [isCollapsed, onCollapseChange] as [boolean, typeof onCollapseChange];
}

function getCollapsibleStateFromStorage() {
  return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
}

function storeCollapsibleState(collapsed: boolean) {
  if (collapsed) {
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
  }
}

export default useCollapsible;
