import React, { useMemo } from 'react';
import { EmailAuthProvider } from 'firebase/auth';
import { useUser } from 'reactfire';

import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';

const links = {
  General: {
    path: '/settings/profile',
    i18n: 'profile:generalTab',
  },
  Authentication: {
    path: '/settings/profile/authentication',
    i18n: 'profile:authenticationTab',
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

const ProfileSettingsTabs = () => {
  const { data: user } = useUser();

  // user can only edit email and password
  // if they signed up with the EmailAuthProvider provider
  const canEditEmailAndPassword = useMemo(() => {
    const emailProviderId = EmailAuthProvider.PROVIDER_ID;

    if (!user) {
      return false;
    }

    return user.providerData.some((item) => {
      return item.providerId === emailProviderId;
    });
  }, [user]);

  const itemClassName = `flex justify-center md:justify-start items-center flex-auto md:flex-initial`;

  return (
    <NavigationMenu vertical secondary>
      <NavigationItem
        className={itemClassName}
        link={links.General}
        depth={0}
      />

      <NavigationItem className={itemClassName} link={links.Authentication} />

      <NavigationItem
        className={itemClassName}
        disabled={!canEditEmailAndPassword}
        link={links.Email}
      />

      <NavigationItem
        className={itemClassName}
        disabled={!canEditEmailAndPassword}
        link={links.Password}
      />
    </NavigationMenu>
  );
};

export default ProfileSettingsTabs;
