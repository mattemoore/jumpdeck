import type { UserInfo } from 'firebase/auth';
import { Trans } from 'next-i18next';
import { Menu } from '@headlessui/react';

import {
  UserIcon,
  UserGroupIcon,
  LogoutIcon,
  ViewGridIcon,
  ChevronDownIcon,
  CreditCardIcon,
} from '@heroicons/react/outline';

import Dropdown from '~/core/ui/Dropdown';
import ProfileAvatar from './ProfileAvatar';

const ProfileDropdown: React.FC<{
  user: Maybe<UserInfo>;
  signOutRequested: () => void;
}> = ({ user, signOutRequested }) => {
  const ProfileDropdownButton = (
    <Menu.Button
      as={'span'}
      className={'flex flex-row space-x-2' + ' items-center cursor-pointer'}
    >
      <ProfileAvatar user={user} />
      <ChevronDownIcon className={'h-3 hidden sm:block'} />
    </Menu.Button>
  );

  const items = [
    <ProfileDropdownMenuItem key={'profile'} href={'/dashboard'}>
      <ViewGridIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:dashboardTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <ProfileDropdownMenuItem key={'profile'} href={'/settings/profile'}>
      <UserIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:profileSettingsTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <ProfileDropdownMenuItem key={'team'} href={'/settings/organization'}>
      <UserGroupIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:organizationSettingsTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <ProfileDropdownMenuItem
      key={'subscription'}
      href={'/settings/subscription'}
    >
      <CreditCardIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:subscriptionSettingsTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <Dropdown.Divider key={'divider'} />,
    <ProfileDropdownMenuItem key={'sign-out'} onClick={signOutRequested}>
      <LogoutIcon className={'h-5'} />
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
      <span className={'flex space-x-4 items-center space-between w-full'}>
        {props.children}
      </span>
    </Dropdown.Item>
  );
}

export default ProfileDropdown;
