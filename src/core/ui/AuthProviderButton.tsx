import Image from 'next/image';
import Button from '../ui/Button';

const AuthProviderButton: React.FC<{
  image: string;
  onClick: () => void;
}> = ({ children, image, onClick }) => {
  return (
    <Button
      data-cy={'oauth-sign-in-button'}
      block
      color={'custom'}
      className={`AuthProviderButton`}
      onClick={onClick}
    >
      <div className={'absolute left-2 top-1.5 h-full items-center'}>
        <Image
          className={'rounded-full h-full'}
          src={image}
          alt={'Auth Provider Logo'}
          width={27}
          height={27}
        />
      </div>

      <div className={'flex items-center justify-center'}>
        <span className={'text-current'}>{children}</span>
      </div>
    </Button>
  );
};

export default AuthProviderButton;
