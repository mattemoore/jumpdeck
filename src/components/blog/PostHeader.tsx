import Link from 'next/link';

import configuration from '~/configuration';

import Post from '~/core/blog/types/post';
import If from '~/core/ui/If';
import BlogPostSvgBanner from '~/components/blog/BlogPostSvgBanner';
import Author from '~/components/blog/Author';

import DateFormatter from './DateFormatter';
import CoverImage from './CoverImage';
import PostTitle from './PostTitle';
import CollectionTag from './CollectionTag';
import Tag from './Tag';

type Props = {
  post: Post;
};

const PostHeader = ({ post }: Props) => {
  const { title, date, readingTime, collection } = post;

  const coverImage = 'coverImage' in post ? post.coverImage : '';
  const tags = post.tags ?? [];

  // NB: change this to display the post's image
  const displayImage = true;
  const preloadImage = true;

  return (
    <>
      <PostTitle>
        <CollectionTag logoSize="22px" collection={collection} />

        {title}
      </PostTitle>

      <div className="mx-auto mb-6 flex">
        <div className="flex flex-row space-x-2 items-center text-gray-600 dark:text-gray-200 text-sm">
          <If condition={post.author}>
            {(author) => <Author author={author} />}
          </If>

          <div>
            <DateFormatter dateString={date} />
          </div>

          <span>·</span>
          <span>{readingTime}</span>

          <If condition={tags.length}>
            <div className={'hidden sm:flex space-x-2 items-center'}>
              <span>·</span>

              <div className={'flex space-x-2 justify-start'}>
                <PostTags tags={tags} collection={collection.name} />
              </div>
            </div>
          </If>
        </div>
      </div>

      <If condition={displayImage}>
        {coverImage ? (
          <div className="mx-auto justify-center">
            <CoverImage
              preloadImage={preloadImage}
              className="shadow-xl rounded-md"
              width="100%"
              height="auto"
              title={title}
              src={coverImage}
            />
          </div>
        ) : (
          <If condition={configuration.autoBanners}>
            <BlogPostSvgBanner
              className="shadow-xl rounded-md mx-auto"
              width={'800px'}
              imageUrl={collection.logo ?? ''}
              title={post.title}
              emoji={collection.emoji}
            />
          </If>
        )}
      </If>
    </>
  );
};

function PostTags({
  tags,
  collection,
}: {
  tags: string[];
  collection: string;
}) {
  return (
    <>
      {tags
        .filter((tag) => {
          // exclude collections with the same name as the tag
          return tag.toLowerCase() !== collection.toLowerCase();
        })
        .map((tag) => {
          const hrefAs = `/blog/tags/${tag}`;
          const href = `/blog/tags/[tag]`;

          return (
            <Link key={tag} href={href} as={hrefAs} passHref>
              <a>
                <Tag>{tag}</Tag>
              </a>
            </Link>
          );
        })}
    </>
  );
}

export default PostHeader;
