import Heading from '~/core/ui/Heading';
import Link from 'next/link';

export default function DashboardDemo() {
  return (
    <div className={'flex flex-col space-y-6'}>
      <Tile>
        <Heading type={2}>Hi, welcome to Makerkit</Heading>

        <p>This is the initial page of this template.</p>

        <p>
          You can configure it by changing the property
          <span className={'bg-gray-100 p-1 font-monospace'}>
            paths.appHome
          </span>{' '}
          in the configuration file of the application.
        </p>
      </Tile>

      <Tile>
        <Heading type={2}>Read the Documentation</Heading>

        <p>
          Before getting started, we recommend to check out the{' '}
          <Link className={'underline'} href={'https://makerkit.dev/docs'}>
            documentation for the Next.js starter
          </Link>
        </p>
      </Tile>

      <Tile>
        <Heading type={2}>Add another page</Heading>

        <p>
          To add a new page, create a file at{' '}
          <span className={'bg-gray-100 p-1 font-monospace'}>
            pages/[filename].tsx
          </span>
        </p>
      </Tile>

      <Tile>
        <Heading type={2}>Add a blog post</Heading>

        <p>
          To add a new blog post, add an MDX file at{' '}
          <span className={'bg-gray-100 p-1 font-monospace'}>
            _posts/[filename].mdx
          </span>
        </p>
      </Tile>

      <Tile>
        <Heading type={2}>Contact me</Heading>

        <p>
          Need help?{' '}
          <Link className={'underline'} href="/contact">
            Let me know
          </Link>{' '}
        </p>
      </Tile>
    </div>
  );
}

function Tile(
  props: React.PropsWithChildren<{
    className?: string;
  }>
) {
  return (
    <div
      className={`${
        props.className ?? ''
      } flex flex-col space-y-2 rounded-md border border-gray-100 bg-gray-50 p-6`}
    >
      {props.children}
    </div>
  );
}
