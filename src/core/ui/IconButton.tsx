import React, { createElement, PropsWithChildren } from 'react';

type DefaultProps = React.ButtonHTMLAttributes<unknown> & {
  loading?: boolean;
  label?: string;
};

type DivProps<TTag extends React.ElementType = 'div'> =
  React.HTMLAttributes<unknown> & {
    loading?: boolean;
    disabled?: boolean;
    label?: string;
    as: TTag;
  };

function IconButton({
  className,
  loading,
  disabled,
  children,
  label,
  ...props
}: React.PropsWithChildren<DefaultProps | DivProps>) {
  const allProps = {
    ...props,
    className: `IconButton ${className ?? ''}`,
    disabled: loading || disabled,
    'aria-label': label,
    title: label,
  };

  const Element = ({ children }: PropsWithChildren) => {
    const tag = 'as' in props ? props.as : 'button';

    return createElement(tag, allProps, children);
  };

  return <Element {...props}>{children}</Element>;
}

export default IconButton;
