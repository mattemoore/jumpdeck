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
          'text-center flex flex-row space-x-1 items-center cursor-pointer',
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
