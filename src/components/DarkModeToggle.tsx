import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'next-i18next';
import { Transition } from '@headlessui/react';

import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';

import {
  setTheme,
  DARK_THEME_CLASSNAME,
  LIGHT_THEME_CLASSNAME,
  getStoredTheme,
  getDefaultTheme,
} from '~/core/theming';

import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';
import IconButton from '~/core/ui/IconButton';

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
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          className={'flex items-center bg-transparent p-1'}
          onClick={toggleMode}
        >
          <Transition
            appear
            show
            enter="transition-opacity duration-500"
            enterFrom="opacity-60"
            enterTo="opacity-100"
          >
            {Icon}
          </Transition>
        </IconButton>
      </TooltipTrigger>

      <TooltipContent>{TooltipText}</TooltipContent>
    </Tooltip>
  );
};

export default DarkModeToggle;
