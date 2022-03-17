import Link from 'next/link';
import LogoImage from './LogoImage';

const Logo: React.FC<{ href?: string; className?: string }> = ({
  href,
  className,
}) => {
  return (
    <Link href={href ?? '/'} passHref>
      <a>
        <LogoImage className={className} />
      </a>
    </Link>
  );
};

export default Logo;
