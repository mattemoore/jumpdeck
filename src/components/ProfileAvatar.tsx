import Image from 'next/image';
import type { UserInfo } from 'firebase/auth';
import If from '~/core/ui/If';

import FallbackUserAvatar from './FallbackUserAvatar';

const ProfileAvatar: React.FCC<{ user: Maybe<UserInfo> }> = ({ user }) => {
  const photoURL = user?.photoURL;

  if (!user) {
    return null;
  }

  return (
    <If
      condition={photoURL}
      fallback={<FallbackUserAvatar text={getUserInitials(user)} />}
    >
      {(url) => (
        <Image
          objectFit={'contain'}
          width={'36'}
          height={'36'}
          className={'rounded-full'}
          src={url}
          alt={url}
        />
      )}
    </If>
  );
};

function getUserInitials(user: UserInfo) {
  const displayName = getDisplayName(user);

  return displayName[0];
}

function getDisplayName(user: UserInfo) {
  if (user.displayName) {
    return user.displayName;
  }

  return user.email ?? '';
}

export default ProfileAvatar;
