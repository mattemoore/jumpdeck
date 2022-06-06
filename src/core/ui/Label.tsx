import { createElement } from 'react';

type Props = React.LabelHTMLAttributes<unknown> & {
  as?: string;
};

const Label: React.FCC<Props> = ({ children, className, as, ...props }) => {
  const tag = as ?? `label`;

  return createElement(
    tag,
    {
      className: `Label ${className ?? ''}`,
      ...props,
    },
    children
  );
};

export default Label;
