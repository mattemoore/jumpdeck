import Image from 'next/future/image';

import Alert from '~/core/ui/Alert';
import configuration from '~/configuration';

import TextField from '~/core/ui/TextField';
import LazyRender from '~/core/ui/LazyRender';
import ClientOnly from '~/core/ui/ClientOnly';
import Button from '~/core/ui/Button';
import Badge from '~/core/ui/Badge';
import ImageUploadInput from '~/core/ui/ImageUploadInput';
import Heading from '~/core/ui/Heading';
import TweetEmbed from './TweetEmbed';
import classNames from 'classnames';

const NextImage: React.FCC<StringObject> = ({
  width,
  height,
  ...props
}: StringObject) => {
  const className = classNames(props.class, `object-cover`);

  return (
    <Image
      className={className}
      src={props.src}
      alt={props.alt}
      width={width}
      height={height}
      {...props}
    />
  );
};

const ExternalLink: React.FCC<{ href: string }> = ({ href, children }) => {
  const siteUrl = configuration.site.siteUrl ?? '';
  const isRoot = href[0] === '/';
  const isInternalLink = href.startsWith(siteUrl) || isRoot;

  if (isInternalLink) {
    return <a href={href}>{children}</a>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const Video: React.FCC<{
  src: string;
  width?: string;
  type?: string;
}> = ({ src, type, width }) => {
  const useType = type ?? 'video/mp4';

  return (
    <ClientOnly>
      <LazyRender rootMargin={'-200px 0px'}>
        <video
          className="my-4"
          width={width ?? `100%`}
          height="auto"
          playsInline
          autoPlay
          muted
          loop
        >
          <source src={src} type={useType} />
        </video>
      </LazyRender>
    </ClientOnly>
  );
};

const MDXComponents = {
  img: NextImage,
  a: ExternalLink,
  TweetEmbed,
  Video,
  Alert,
  Image: NextImage,
  Button,
  Badge,
  ImageUploadInput,
  Heading,
  TextField,
};

export default MDXComponents;
