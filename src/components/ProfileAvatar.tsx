import Image from 'next/image';
import type { UserInfo } from 'firebase/auth';

import FallbackUserAvatar from './FallbackUserAvatar';

const ProfileAvatar: React.FCC<{ user: Maybe<UserInfo> }> = ({ user }) => {
  const photoURL = user?.photoURL;

  if (!user) {
    return null;
  }

  if (photoURL) {
    return (
      <Image
        objectFit={'cover'}
        width={'36'}
        height={'36'}
        className={'rounded-full'}
        src={photoURL}
        alt={photoURL}
      />
    );
  }

  return <FallbackUserAvatar text={getUserInitials(user)} />;
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
