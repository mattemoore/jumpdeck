import Image from 'next/image';

import {
  AtSymbolIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

const DEFAULT_IMAGE_SIZE = 22;

const AuthProviderLogo: React.FC<{
  firebaseProviderId: string;
  width?: number;
  height?: number;
}> = ({ firebaseProviderId, width, height }) => {
  const image = getOAuthProviderLogos()[firebaseProviderId];

  if (typeof image === `string`) {
    return (
      <Image
        src={image}
        alt={`${firebaseProviderId} logo`}
        width={width ?? DEFAULT_IMAGE_SIZE}
        height={height ?? DEFAULT_IMAGE_SIZE}
      />
    );
  }

  return <>{image}</>;
};

function getOAuthProviderLogos(): Record<string, string | JSX.Element> {
  return {
    ['password']: <AtSymbolIcon className={'h-7'} />,
    ['phone']: <DevicePhoneMobileIcon className={'h-7'} />,
    ['google.com']: '/assets/images/google.webp',
    ['facebook.com']: '/assets/images/facebook.webp',
    ['twitter.com']: '/assets/images/twitter.webp',
    ['github.com']: '/assets/images/github.webp',
    ['microsoft.com']: '/assets/images/microsoft.webp',
    ['apple.com']: '/assets/images/apple.webp',
  };
}

export default AuthProviderLogo;
