import { useMemo } from 'react';
import { Trans } from 'next-i18next';
import type { UserInfo } from 'firebase/auth';
import Link from 'next/link';

import {
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  PaintBrushIcon,
  SunIcon,
  ComputerDesktopIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '~/core/ui/Dropdown';

import ProfileAvatar from './ProfileAvatar';
import configuration from '~/configuration';

import {
  setTheme,
  DARK_THEME_CLASSNAME,
  LIGHT_THEME_CLASSNAME,
  SYSTEM_THEME_CLASSNAME,
} from '~/core/theming';

import If from '~/core/ui/If';

const ProfileDropdown: React.FCC<{
  user: Maybe<UserInfo>;
  signOutRequested: () => void;
}> = ({ user, signOutRequested }) => {
  const signedInAsLabel = useMemo(() => {
    return (
      user?.email ??
      user?.phoneNumber ?? <Trans i18nKey={'common:anonymousUser'} />
    );
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          'flex cursor-pointer items-center space-x-2 focus:outline-none'
        }
      >
        <ProfileAvatar user={user} />

        <ChevronDownIcon className={'h-4'} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={'!min-w-[15rem]'}
        collisionPadding={{ right: 20 }}
      >
        <DropdownMenuItem
          className={'!h-10 rounded-none py-0'}
          clickable={false}
        >
          <div
            className={'flex flex-col justify-start truncate text-left text-xs'}
          >
            <div className={'text-gray-500'}>Signed in as</div>

            <div>
              <span className={'block truncate'}>{signedInAsLabel}</span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link
            href={configuration.paths.appHome}
            className={'flex h-full w-full items-center space-x-2'}
          >
            <Squares2X2Icon className={'h-5'} />
            <span>
              <Trans i18nKey={'common:dashboardTabLabel'} />
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href={'/settings/profile'}
            className={'flex h-full w-full items-center space-x-2'}
          >
            <Cog8ToothIcon className={'h-5'} />
            <span>
              <Trans i18nKey={'common:settingsTabLabel'} />
            </span>
          </Link>
        </DropdownMenuItem>

        <If condition={configuration.enableThemeSwitcher}>
          <ThemeSelectorSubMenu />
        </If>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          role={'button'}
          onClick={signOutRequested}
          className={'flex !cursor-pointer items-center space-x-2'}
        >
          <ArrowLeftOnRectangleIcon className={'h-5'} />

          <span>
            <Trans i18nKey={'auth:signOut'} />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function ThemeSelectorSubMenu() {
  const Wrapper: React.FCC = ({ children }) => (
    <span className={'flex items-center space-x-2.5'}>{children}</span>
  );

  return (
    <>
      <DropdownMenuSeparator className={'hidden lg:flex'} />

      <DropdownMenuSub>
        <DropdownMenuSubTrigger className={'hidden lg:flex'}>
          <Wrapper>
            <PaintBrushIcon className={'h-5'} />

            <span>
              <Trans i18nKey={'common:theme'} />
            </span>
          </Wrapper>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent>
          <DropdownMenuItem
            className={'cursor-pointer'}
            onClick={() => setTheme(LIGHT_THEME_CLASSNAME)}
          >
            <Wrapper>
              <SunIcon className={'h-4'} />

              <span>
                <Trans i18nKey={'common:lightTheme'} />
              </span>
            </Wrapper>
          </DropdownMenuItem>

          <DropdownMenuItem
            className={'cursor-pointer'}
            onClick={() => setTheme(DARK_THEME_CLASSNAME)}
          >
            <Wrapper>
              <MoonIcon className={'h-4'} />

              <span>
                <Trans i18nKey={'common:darkTheme'} />
              </span>
            </Wrapper>
          </DropdownMenuItem>

          <DropdownMenuItem
            className={'cursor-pointer'}
            onClick={() => setTheme(SYSTEM_THEME_CLASSNAME)}
          >
            <Wrapper>
              <ComputerDesktopIcon className={'h-4'} />

              <span>
                <Trans i18nKey={'common:systemTheme'} />
              </span>
            </Wrapper>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}

export default ProfileDropdown;
