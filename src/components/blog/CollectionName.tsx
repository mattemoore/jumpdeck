import cn from 'classnames';
import Link from 'next/link';

import Collection from '~/core/blog/types/collection';
import CollectionImage from './CollectionImage';

function CollectionName({
  collection,
  logoSize,
}: {
  collection: Collection;
  logoSize?: string;
}) {
  const size = logoSize ?? `16px`;

  const href = `/blog/[collection]`;
  const hrefAs = `/blog/${collection.name.toLowerCase()}`;

  return (
    <Link href={href} as={hrefAs} passHref>
      <div
        className={cn(
          'flex cursor-pointer flex-row items-center space-x-1 text-center',
          getCollectionClass(collection.name)
        )}
      >
        <CollectionImage collection={collection} size={size} />

        <span className="hover:underline">{collection.name}</span>
      </div>
    </Link>
  );
}

export default CollectionName;

function getCollectionClass(name: string) {
  return `collection--${name.toLowerCase()}`;
}
