import Post from '~/core/blog/types/post';

import PostPreview from './PostPreview';
import GridList from './GridList';

type Props = {
  posts: Post[];
};

const POSTS_IMAGES_TO_PRELOAD = 4;

const PostsList = ({ posts }: Props) => {
  return (
    <GridList>
      {posts.map((post, index) => {
        // to avoid lazy-loading images above-the-fold
        // we preload the first {@link POSTS_IMAGES_TO_PRELOAD} images
        // so to avoid bad UX and a low Core Vitals score
        const preloadImage = index < POSTS_IMAGES_TO_PRELOAD;

        return (
          <PostPreview
            preloadImage={preloadImage}
            key={post.slug}
            post={post}
          />
        );
      })}
    </GridList>
  );
};

export default PostsList;
