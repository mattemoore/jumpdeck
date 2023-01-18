import { useMemo } from 'react';

import type { UserInfo } from 'firebase/auth';
import { Trans } from 'next-i18next';
import { Menu } from '@headlessui/react';

import {
  ChevronDownIcon,
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

import Dropdown from '~/core/ui/Dropdown';
import ProfileAvatar from './ProfileAvatar';

const ProfileDropdown: React.FCC<{
  user: Maybe<UserInfo>;
  signOutRequested: () => void;
}> = ({ user, signOutRequested }) => {
  const ProfileDropdownButton = (
    <Menu.Button
      as={'span'}
      className={'flex cursor-pointer items-center space-x-2'}
    >
      <ProfileAvatar user={user} />
      <ChevronDownIcon className={'hidden h-3 sm:block'} />
    </Menu.Button>
  );

  const signedInAsLabel = useMemo(() => {
    return (
      user?.email ??
      user?.phoneNumber ?? <Trans i18nKey={'common:anonymousUser'} />
    );
  }, [user]);

  const items = [
    <Dropdown.Item className={'rounded-none py-0'} key={'signedInAs'}>
      <div className={'flex flex-col justify-start truncate text-left text-xs'}>
        <div className={'text-gray-500'}>Signed in as</div>

        <div>
          <span className={'block truncate'}>{signedInAsLabel}</span>
        </div>
      </div>
    </Dropdown.Item>,
    <Dropdown.Divider key={'divider1'} />,
    <ProfileDropdownMenuItem key={'profile'} href={'/dashboard'}>
      <Squares2X2Icon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:dashboardTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <ProfileDropdownMenuItem key={'profile'} href={'/settings/profile'}>
      <Cog8ToothIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:settingsTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <Dropdown.Divider key={'divider2'} />,
    <ProfileDropdownMenuItem key={'sign-out'} onClick={signOutRequested}>
      <ArrowLeftOnRectangleIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'auth:signOut'} />
      </span>
    </ProfileDropdownMenuItem>,
  ];

  return <Dropdown button={ProfileDropdownButton} items={items} />;
};

function ProfileDropdownMenuItem(
  props: React.PropsWithChildren<
    | {
        onClick?: () => void;
      }
    | {
        href?: string;
      }
  >
) {
  const onClick = 'onClick' in props ? props.onClick : undefined;
  const href = 'href' in props ? props.href : undefined;

  return (
    <Dropdown.Item href={href} onClick={onClick}>
      <span className={'space-between flex w-full items-center space-x-4'}>
        {props.children}
      </span>
    </Dropdown.Item>
  );
}

export default ProfileDropdown;
