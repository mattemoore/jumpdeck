import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import React, { useMemo } from 'react';
import { EmailAuthProvider, User } from 'firebase/auth';

const links = {
  General: {
    path: '/settings/profile',
    i18n: 'profile:generalTab',
  },
  Email: {
    path: '/settings/profile/email',
    i18n: 'profile:emailTab',
  },
  Password: {
    path: '/settings/profile/password',
    i18n: 'profile:passwordTab',
  },
};

const ProfileSettingsTabs: React.FC<{
  user: User;
}> = ({ user }) => {
  // user can only edit email and password
  // if they signed up with the EmailAuthProvider provider
  const canEditEmailAndPassword = useMemo(() => {
    const emailProviderId = EmailAuthProvider.PROVIDER_ID;

    return user.providerData.some((item) => {
      return item.providerId === emailProviderId;
    });
  }, [user]);

  return (
    <div
      className={
        'flex flex-row space-x-2 sm:space-x-0 sm:flex-col sm:space-y-2'
      }
    >
      <NavigationItem
        className={'flex-auto sm:flex-initial'}
        link={links.General}
        depth={0}
      />

      <NavigationItem
        className={'flex-auto sm:flex-initial'}
        disabled={!canEditEmailAndPassword}
        link={links.Email}
      />

      <NavigationItem
        className={'flex-auto sm:flex-initial'}
        disabled={!canEditEmailAndPassword}
        link={links.Password}
      />
    </div>
  );
};

export default ProfileSettingsTabs;
