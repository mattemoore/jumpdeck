import Image from 'next/image';
import AuthorType from '~/core/blog/types/author';

const Author: React.FCC<{ author: AuthorType }> = ({ author }) => {
  const alt = `${author.name}'s picture`;
  const imageSize = 45;

  return (
    <div className="flex flex-row items-center space-x-3">
      <a target="_blank" rel="noreferrer noopened" href={author.url}>
        <Image
          width={imageSize}
          height={imageSize}
          src={author.picture}
          alt={alt}
        />

        {author.name}
      </a>
    </div>
  );
};

export default Author;
