import cn from 'classnames';
import Link from 'next/link';

import Collection from '~/core/blog/types/collection';
import CollectionImage from './CollectionImage';

function CollectionName({
  collection,
  logoSize,
}: {
  collection: Collection;
  logoSize?: number;
}) {
  const size = logoSize ?? 16;

  const href = `/blog/[collection]`;
  const hrefAs = `/blog/${collection.name.toLowerCase()}`;

  return (
    <Link href={href} as={hrefAs}>
      <span
        className={cn(
          'flex cursor-pointer flex-row items-center text-gray-600' +
            ' space-x-1 text-center dark:text-gray-300',
          getCollectionClass(collection.name)
        )}
      >
        <CollectionImage collection={collection} size={size} />

        <span className="hover:underline">{collection.name}</span>
      </span>
    </Link>
  );
}

export default CollectionName;

function getCollectionClass(name: string) {
  return `collection--${name.toLowerCase()}`;
}
