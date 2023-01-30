import { useMemo } from 'react';
import { Trans } from 'next-i18next';
import type { UserInfo } from 'firebase/auth';
import Link from 'next/link';

import {
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';

import ProfileAvatar from './ProfileAvatar';
import configuration from '~/configuration';

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
        <DropdownMenuItem className={'rounded-none py-0'} clickable={false}>
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
            className={'flex w-full items-center space-x-2'}
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
            className={'flex w-full items-center space-x-2'}
          >
            <Cog8ToothIcon className={'h-5'} />
            <span>
              <Trans i18nKey={'common:settingsTabLabel'} />
            </span>
          </Link>
        </DropdownMenuItem>

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

export default ProfileDropdown;
