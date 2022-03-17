import { useState, useEffect, Fragment } from 'react';
import * as runtime from 'react/jsx-runtime.js';
import { run } from '@mdx-js/mdx';

import MDXComponents from '~/components/blog/MDXComponents';

type MdxComponent = React.ExoticComponent<{
  components: Record<string, React.ReactNode>;
}>;

export default function MDXRenderer({ code }: { code: string }) {
  const [MdxModule, setMdxModule] = useState<{
    default: MdxComponent;
  }>();

  const Content = MdxModule
    ? () => <MdxModule.default components={MDXComponents} />
    : Fragment;

  useEffect(() => {
    void (async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const evaluatedMdx = (await run(code, runtime)) as {
        default: MdxComponent;
      };

      setMdxModule(evaluatedMdx);
    })();
  }, [code]);

  return <Content />;
}
