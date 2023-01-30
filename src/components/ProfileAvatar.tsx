import type { UserInfo } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '~/core/ui/Avatar';

type ProfileAvatarProps =
  | {
      user: Maybe<UserInfo>;
    }
  | {
      text: Maybe<string>;
    };

const ProfileAvatar: React.FCC<ProfileAvatarProps> = (props) => {
  if ('user' in props && props.user) {
    return (
      <Avatar>
        {props.user.photoURL ? <AvatarImage src={props.user.photoURL} /> : null}

        <AvatarFallback>{getUserInitials(props.user)}</AvatarFallback>
      </Avatar>
    );
  }

  if ('text' in props && props.text) {
    return (
      <Avatar>
        <AvatarFallback>{props.text[0]}</AvatarFallback>
      </Avatar>
    );
  }

  return null;
};

function getUserInitials(user: UserInfo) {
  const displayName = getDisplayName(user);

  return displayName[0] ?? '';
}

function getDisplayName(user: UserInfo) {
  if (user.displayName) {
    return user.displayName;
  }

  return user.email ?? 'Anonymous';
}

export default ProfileAvatar;
