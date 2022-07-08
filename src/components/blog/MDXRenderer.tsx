import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';

import MDXComponents from '~/components/blog/MDXComponents';

type MdxComponent = React.ExoticComponent<{
  components: typeof MDXComponents;
}>;

function MDXRenderer({ code }: { code: string }) {
  const { default: MdxModuleComponent } = runSync(code, runtime) as {
    default: MdxComponent;
  };

  return <MdxModuleComponent components={MDXComponents} />;
}

export default MDXRenderer;
