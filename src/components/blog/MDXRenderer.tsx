import * as runtime from 'react/jsx-runtime.js';
import { runSync } from '@mdx-js/mdx';

import MDXComponents from '~/components/blog/MDXComponents';

type MdxComponent = React.ExoticComponent<{
  components: Record<string, React.ReactNode>;
}>;

export default function MDXRenderer({ code }: { code: string }) {
  const { default: MdxModuleComponent } = (runSync(code, runtime)) as {
    default: MdxComponent;
  };

  return <MdxModuleComponent components={MDXComponents} />
}
