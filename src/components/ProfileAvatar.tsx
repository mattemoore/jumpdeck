import Image from 'next/image';
import type { UserInfo } from 'firebase/auth';

import FallbackUserAvatar from './FallbackUserAvatar';

const ProfileAvatar: React.FCC<{ user: Maybe<UserInfo> }> = ({ user }) => {
  if (!user) {
    return null;
  }

  const photoURL = user?.photoURL;
  const size = 36;

  if (photoURL) {
    return (
      <div>
        <Image
          width={size}
          height={size}
          className={'rounded-full object-cover'}
          src={photoURL}
          alt={photoURL}
          style={{ height: size }}
        />
      </div>
    );
  }

  return <FallbackUserAvatar text={getUserInitials(user)} />;
};

function getUserInitials(user: UserInfo) {
  const displayName = getDisplayName(user);

  return displayName[0] ?? '';
}

function getDisplayName(user: UserInfo) {
  if (user.displayName) {
    return user.displayName;
  }

  return user.email ?? '';
}

export default ProfileAvatar;
