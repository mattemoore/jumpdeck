import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

const PostHeadings: React.FC<{
  headings: Array<{ text: string; level: number }>;
}> = ({ headings }) => {
  if (!headings.length) {
    return null;
  }

  const indexes = headings
    .filter((item) => item.level === 2)
    .reduce<Record<string, number>>((acc, item, index) => {
      acc[item.text] = index;

      return acc;
    }, {});

  return (
    <div className={'flex flex-col space-y-4'}>
      <Heading type={6}>
        <span
          className={
            'text-sm font-bold uppercase text-gray-700 dark:text-gray-300'
          }
        >
          Table of Contents
        </span>
      </Heading>

      <div className={'flex flex-col space-y-2'}>
        {headings.map((heading, index) => {
          const slug = heading.text
            .split(' ')
            .map((s) => s.toLowerCase())
            .map((s) => s.replace(/\W/gi, ''))
            .join('-');

          const marginTop =
            index > 0
              ? headings[index - 1].level > heading.level && heading.level === 2
                ? 20
                : undefined
              : undefined;

          const marginLeft = `${(heading.level - 1) * 14}px`;
          const style = { marginLeft, marginTop };

          return (
            <ol key={heading.text} className={'flex'} style={style}>
              <li>
                <a
                  className={
                    'font-medium text-gray-400 hover:text-gray-700' +
                    ' text-sm transition-all dark:hover:text-white'
                  }
                  href={`#${slug}`}
                >
                  <If condition={heading.level === 2}>
                    {indexes[heading.text] + 1})
                  </If>

                  <span> {heading.text}</span>
                </a>
              </li>
            </ol>
          );
        })}
      </div>
    </div>
  );
};

export default PostHeadings;
