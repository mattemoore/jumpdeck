import Link from 'next/link';
import Post from '~/core/blog/types/post';

import configuration from '~/configuration';
import If from '~/core/ui/If';
import BlogPostSvgBanner from '~/components/blog/BlogPostSvgBanner';

import DateFormatter from './DateFormatter';
import CoverImage from './CoverImage';
import CollectionName from './CollectionName';

type Props = {
  post: Post;
  preloadImage?: boolean;
};

const PostPreview = ({ post, preloadImage }: Props) => {
  const { title, slug, coverImage, collection, date, readingTime, excerpt } =
    post;

  const hrefAs = `/blog/${collection.name.toLowerCase()}/${slug}`;
  const href = `/blog/[collection]/[slug]`;

  return (
    <div className="rounded-lg transition-shadow duration-500 dark:text-gray-800">
      <div className="relative mb-2 h-[350px] w-full">
        <If condition={coverImage}>
          <Link as={hrefAs} href={href} passHref>
            <a>
              <CoverImage
                preloadImage={preloadImage}
                slug={slug}
                title={title}
                src={coverImage}
              />
            </a>
          </Link>
        </If>

        <If condition={!coverImage && configuration.autoBanners}>
          <Link as={hrefAs} href={href} passHref>
            <a>
              <BlogPostSvgBanner
                imageUrl={collection.logo ?? ''}
                title={post.title}
                height={'300px'}
                width={'100%'}
                emoji={collection.emoji}
              />
            </a>
          </Link>
        </If>
      </div>

      <div className={'px-1'}>
        <div className="flex flex-col space-y-1 px-1 py-2">
          <h3 className="px-1 text-2xl font-bold leading-snug dark:text-white">
            <Link as={hrefAs} href={href}>
              <a className="hover:underline">{title}</a>
            </Link>
          </h3>
        </div>

        <div className="mb-2 flex flex-row items-center space-x-2 px-1 text-sm">
          <div className="text-gray-600 dark:text-gray-300">
            <DateFormatter dateString={date} />
          </div>

          <span className="text-gray-600 dark:text-gray-300">·</span>
          <span className="text-gray-600 dark:text-gray-300">
            {readingTime}
          </span>
          <span className="text-gray-600 dark:text-gray-300">·</span>
          <span>
            <CollectionName collection={collection} />
          </span>
        </div>

        <p className="mb-4 px-1 text-sm leading-relaxed dark:text-gray-300">
          {excerpt}
        </p>
      </div>
    </div>
  );
};

export default PostPreview;
