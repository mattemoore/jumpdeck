import Link from 'next/link';

import Collection from '~/core/blog/types/collection';
import CollectionImage from './CollectionImage';

function CollectionTag({
  collection,
  logoSize,
}: {
  collection: Collection;
  logoSize?: number;
}) {
  const size = logoSize ?? 16;

  const hrefAs = `/blog/${collection.name.toLowerCase()}`;
  const href = `/blog/[collection]`;

  return (
    <Link href={href} as={hrefAs}>
      <span className="flex flex-row items-center space-x-1 py-2 md:py-4">
        <CollectionImage collection={collection} size={size} />

        <span className={'text-base font-medium'}>{collection.name}</span>
      </span>
    </Link>
  );
}

export default CollectionTag;
