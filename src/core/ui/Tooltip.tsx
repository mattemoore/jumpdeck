import Tippy from '@tippyjs/react';

const Tooltip: React.FCC<{
  content: string | undefined | JSX.Element;
  className?: string;
}> = ({ children, content, className }) => {
  return (
    <Tippy disabled={!content} theme={'makerkit'} content={content}>
      <div className={className}>{children}</div>
    </Tippy>
  );
};

export default Tooltip;
