import Image from 'next/image';
import cn from 'classnames';

type Props = {
  title: string;
  src: string;
  preloadImage?: boolean;
  className?: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug, preloadImage, className }: Props) => {
  return (
    <Image
      className={cn('block rounded-lg object-cover', {
        'duration-250 transition-all hover:opacity-90': slug,
        [`${className ?? ''}`]: true,
      })}
      src={src}
      priority={preloadImage}
      alt={`Cover Image for ${title}`}
      fill
    />
  );
};

export default CoverImage;
