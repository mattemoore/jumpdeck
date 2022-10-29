import { UserIcon } from '@heroicons/react/24/outline';

const FallbackUserAvatar: React.FCC<{ text: Maybe<string> }> = ({ text }) => {
  if (!text) {
    return (
      <span className={`FallbackUserAvatar`}>
        <UserIcon className={'h-5'} />
      </span>
    );
  }

  return <span className={`FallbackUserAvatar`}>{text[0]}</span>;
};

export default FallbackUserAvatar;
