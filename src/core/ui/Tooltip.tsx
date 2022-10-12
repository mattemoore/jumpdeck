import Tippy, { TippyProps } from '@tippyjs/react';

const Tooltip: React.FCC<TippyProps> = ({ children, className, ...props }) => {
  return (
    <Tippy {...props} disabled={!props.content} theme={'makerkit'}>
      <div className={className}>{children}</div>
    </Tippy>
  );
};

export default Tooltip;
