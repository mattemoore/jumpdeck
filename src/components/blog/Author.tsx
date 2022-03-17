import Image from 'next/image';
import AuthorType from '~/core/blog/types/author';

const Author: React.FC<{ author: AuthorType }> = ({ author }) => {
  const alt = `${author.name}'s picture`;
  const imageSize = `45px`;

  return (
    <div className="flex flex-row space-x-3 items-center">
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
