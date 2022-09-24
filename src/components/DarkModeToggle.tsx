import { useCallback, useEffect, useState } from 'react';
import { Trans } from 'next-i18next';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';

import {
  loadThemeFromLocalStorage,
  setTheme,
  DARK_THEME_CLASSNAME,
} from '~/core/theming';

import Tooltip from '~/core/ui/Tooltip';
import IconButton from '~/core/ui/IconButton';

const DarkModeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(
    loadThemeFromLocalStorage()
  );

  const toggleMode = useCallback(() => {
    setCurrentTheme((currentTheme) => {
      return currentTheme ? null : DARK_THEME_CLASSNAME;
    });
  }, []);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const isDarkTheme = currentTheme === DARK_THEME_CLASSNAME;

  const TooltipText = useCallback(
    () =>
      isDarkTheme ? (
        <Trans i18nKey={'common:switchToLightTheme'} />
      ) : (
        <Trans i18nKey={'common:switchToDarkTheme'} />
      ),
    [isDarkTheme]
  );

  const Icon = useCallback(() => {
    return isDarkTheme ? (
      <SunIcon className={'h-5'} />
    ) : (
      <MoonIcon className={'h-5'} />
    );
  }, [isDarkTheme]);

  return (
    <Tooltip content={<TooltipText />}>
      <IconButton
        className={'flex items-center bg-transparent p-1'}
        onClick={toggleMode}
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
