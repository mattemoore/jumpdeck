import Image from 'next/future/image';
import Collection from '~/core/blog/types/collection';

function CollectionImage({
  collection,
  size,
}: {
  collection: Collection;
  size: string;
}) {
  if (collection.emoji) {
    return <span style={{ fontSize: size }}>{collection.emoji}</span>;
  }

  if (collection.logo) {
    return (
      <Image
        className="object-contain"
        loading="lazy"
        height={size}
        width={size}
        src={collection.logo}
        alt={collection.name}
      />
    );
  }

  return null;
}

export default CollectionImage;
