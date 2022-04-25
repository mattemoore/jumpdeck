import Tippy from '@tippyjs/react';

const Tooltip: React.FC<{
  content: string | undefined | JSX.Element;
  className?: string;
}> = ({ children, content, className }) => {
  return (
    <Tippy disabled={!content} theme={'storyjoy'} content={content}>
      <div className={className}>{children}</div>
    </Tippy>
  );
};

export default Tooltip;
