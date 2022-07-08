import { useCallback, useRef } from 'react';
import { MoonIcon } from '@heroicons/react/outline';

import {
  loadThemeFromLocalStorage,
  setTheme,
  DARK_THEME_CLASSNAME,
} from '~/core/theming';

import Tooltip from '~/core/ui/Tooltip';
import IconButton from '~/core/ui/IconButton';

const DarkModeToggle = () => {
  const theme = useRef<string | null>(loadThemeFromLocalStorage());

  const toggleMode = useCallback(() => {
    const themeClass = theme.current ? null : DARK_THEME_CLASSNAME;

    theme.current = themeClass;
    setTheme(themeClass);
  }, []);

  const tooltip = `Toggle dark theme`;

  return (
    <Tooltip content={tooltip}>
      <IconButton
        className={'flex items-center bg-transparent p-1'}
        onClick={toggleMode}
      >
        <MoonIcon className={'h-5'} />
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
