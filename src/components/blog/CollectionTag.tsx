import Link from 'next/link';

import Collection from '~/core/blog/types/collection';
import CollectionImage from './CollectionImage';

function CollectionTag({
  collection,
  logoSize,
}: {
  collection: Collection;
  logoSize?: string;
}) {
  const size = logoSize ?? `16px`;

  const hrefAs = `/blog/${collection.name.toLowerCase()}`;
  const href = `/blog/[collection]`;

  return (
    <Link href={href} as={hrefAs} passHref>
      <a className="flex flex-row space-x-1 items-center py-2 md:py-4">
        <CollectionImage collection={collection} size={size} />

        <span className={'text-base font-medium'}>{collection.name}</span>
      </a>
    </Link>
  );
}

export default CollectionTag;
