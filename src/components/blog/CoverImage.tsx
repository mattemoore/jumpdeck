import Image from 'next/image';
import cn from 'classnames';

import If from '~/core/ui/If';

type Props = {
  title: string;
  src: string;
  preloadImage?: boolean;
  className?: string;
  width?: string;
  height?: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug, preloadImage, className }: Props) => {
  const image = (
    <Image
      layout={'responsive'}
      className={cn('block rounded-lg', {
        'transition-all duration-250 hover:opacity-90': slug,
        [`${className ?? ''}`]: true,
      })}
      src={src}
      priority={preloadImage}
      alt={`Cover Image for ${title}`}
      width={'16'}
      height={'9'}
    />
  );

  return (
    <If condition={slug} fallback={image}>
      {image}
    </If>
  );
};

export default CoverImage;
