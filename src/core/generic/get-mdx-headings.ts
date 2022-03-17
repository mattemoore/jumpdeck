import { DocsHeading } from '~/core/docs/types/docs-heading';

function getHeadingsRegExp(depth: number) {
  return new RegExp(`^#{1,${depth}}([\\w ]+)$`, 'gm');
}

/**
 * @description Extract the headings from an MDX file using a RegExp
 * @param rawMdx
 * @param depth
 */
export function getMdxHeadings(rawMdx: string, depth = 3) {
  const text = rawMdx.split('\n');
  const regExp = getHeadingsRegExp(depth);
  const headingTypeRegExp = /(#)+/;

  const results = text.map((line) => regExp.exec(line)).filter(Boolean);

  return results.reduce<DocsHeading[]>((acc, result) => {
    if (!result) return acc;

    const match = result[0];
    const matchedGroup = result[1];

    const headingTypeMatch = headingTypeRegExp.exec(match) ?? undefined;
    const type = headingTypeMatch ? headingTypeMatch[0].length : 1;

    const item: DocsHeading = {
      type,
      text: matchedGroup.trim(),
    };

    return [...acc, item];
  }, []);
}
