import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'next-i18next';

import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';

import {
  setTheme,
  DARK_THEME_CLASSNAME,
  LIGHT_THEME_CLASSNAME,
  getStoredTheme,
  getDefaultTheme,
} from '~/core/theming';

import Tooltip from '~/core/ui/Tooltip';
import IconButton from '~/core/ui/IconButton';
import { Transition } from '@headlessui/react';

const DarkModeToggle = () => {
  const defaultTheme = useMemo(() => {
    return getStoredTheme() ?? getDefaultTheme();
  }, []);

  const [currentTheme, setCurrentTheme] = useState<string | null>(defaultTheme);

  const toggleMode = useCallback(() => {
    setCurrentTheme((currentTheme) => {
      if (currentTheme === LIGHT_THEME_CLASSNAME) {
        return DARK_THEME_CLASSNAME;
      }

      return LIGHT_THEME_CLASSNAME;
    });
  }, []);

  const isDarkTheme = currentTheme === DARK_THEME_CLASSNAME;

  const TooltipText = isDarkTheme ? (
    <Trans i18nKey={'common:switchToLightTheme'} />
  ) : (
    <Trans i18nKey={'common:switchToDarkTheme'} />
  );

  const Icon = isDarkTheme ? (
    <SunIcon className={'h-5'} />
  ) : (
    <MoonIcon className={'h-5'} />
  );

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  return (
    <Tooltip content={TooltipText}>
      <IconButton
        className={'flex items-center bg-transparent p-1'}
        onClick={toggleMode}
      >
        <Transition
          appear={true}
          show={true}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          {Icon}
        </Transition>
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
