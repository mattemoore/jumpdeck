import BasePost from './base-post';
import Author from './author';

interface Post extends BasePost {
  coverImage: string;
  excerpt: string;

  ogImage: {
    url: string;
  };

  author?: Author;
  canonical?: string;
  tags?: string[];
}

export default Post;
