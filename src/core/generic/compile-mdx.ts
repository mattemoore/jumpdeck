import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';

/**
 * @name compileMdx
 * @param markdown
 * @description Compile MDX to its JS representation.
 * Use in combination with a Component that can render MDX
 * such as {@link MDXRenderer}
 */
export async function compileMdx(markdown: string) {
  const { compile } = await import('@mdx-js/mdx');

  const code = await compile(markdown, {
    outputFormat: 'function-body',
    rehypePlugins: [rehypeHighlight, rehypeSlug, rehypeAutoLinkHeadings],
  });

  return String(code);
}
