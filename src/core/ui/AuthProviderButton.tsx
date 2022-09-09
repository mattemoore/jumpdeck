import Image from 'next/future/image';
import Button from '../ui/Button';

const AuthProviderButton: React.FCC<{
  image: string;
  onClick: () => unknown;
}> = ({ children, image, onClick }) => {
  return (
    <Button
      data-cy={'oauth-sign-in-button'}
      block
      color={'custom'}
      size={'large'}
      className={`AuthProviderButton`}
      onClick={onClick}
    >
      <span className={'absolute left-3 flex items-center justify-start'}>
        <Image
          className={'flex h-full items-center rounded-full'}
          src={image}
          alt={'Auth Provider Logo'}
          width={28}
          height={28}
        />
      </span>

      <span className={'flex w-full flex-1 items-center'}>
        <span className={'flex w-full items-center justify-center'}>
          <span className={'text-current'}>{children}</span>
        </span>
      </span>
    </Button>
  );
};

export default AuthProviderButton;
