import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners';

import If from '~/core/ui/If';

type Color = 'primary' | 'secondary' | 'transparent' | 'danger' | 'custom';
type Size = 'normal' | 'small' | 'large' | 'custom';
type Style = `normal` | `outline` | `flat`;

type Props = React.ButtonHTMLAttributes<unknown> & {
  block?: boolean;
  color?: Color;
  size?: Size;
  style?: Style;
  loading?: boolean;
  href?: string;
};

const getColorClasses = (color: Color) => {
  const colors: Record<Color, string> = {
    primary: `ButtonPrimary`,
    danger: `ButtonDanger`,
    secondary: `ButtonSecondary`,
    transparent: 'ButtonTransparent',
    custom: ``,
  };

  return colors[color];
};

const getSizeClasses = (size: Size) => {
  // cannot be too smart here due to purge-js
  const sizes: Record<Size, string> = {
    normal: `ButtonNormal`,
    large: `ButtonLarge`,
    small: 'ButtonSmall',
    custom: '',
  };

  return sizes[size];
};

const getStyleClasses = (style: Style, color: Color = `primary`) => {
  // cannot be too smart here due to purge-js
  const styles: Record<Style, Record<Color, string>> = {
    normal: {
      primary: ``,
      danger: ``,
      secondary: ``,
      transparent: ``,
      custom: ``,
    },
    outline: {
      primary: `ButtonPrimaryOutline`,
      danger: `ButtonDangerOutline`,
      secondary: ``,
      transparent: ``,
      custom: ``,
    },
    flat: {
      primary: `ButtonPrimaryFlat`,
      danger: `ButtonDangerFlat`,
      secondary: ``,
      transparent: ``,
      custom: ``,
    },
  };

  return styles[style][color];
};

const Button: React.FCC<Props> = ({
  children,
  color,
  size,
  style,
  block,
  loading,
  href,
  ...props
}) => {
  const defaultColor: Color = `primary`;
  const defaultSize: Size = `normal`;
  const defaultStyle: Style = `normal`;

  const useColor = color ?? defaultColor;
  const useSize = size ?? defaultSize;
  const useStyle = style ?? defaultStyle;

  const className = [
    `Button`,
    getColorClasses(useColor),
    getStyleClasses(useStyle, useColor),
    block ? `w-full` : ``,
    loading ? `opacity-70` : ``,
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...props}
      className={className}
      disabled={loading || props.disabled}
    >
      <If condition={loading}>
        <span className={getSizeClasses(useSize)}>
          <Animation style={style || 'normal'} />
        </span>
      </If>

      <If condition={!loading}>
        <InnerButtonContainerElement
          href={href}
          className={getSizeClasses(useSize)}
        >
          {children}
        </InnerButtonContainerElement>
      </If>
    </button>
  );
};

function Animation({ style }: { style: Style }) {
  const color = style === 'normal' ? `#323232` : `currentColor`;

  return (
    <FulfillingBouncingCircleSpinner
      className={'mx-auto'}
      color={color}
      size={20}
      animationDuration={2000}
    />
  );
}

function InnerButtonContainerElement({
  children,
  href,
  className,
}: PropsWithChildren<{ href: Maybe<string>; className: string }>) {
  if (href) {
    return (
      <Link href={href} passHref>
        <a className={`${className} w-full`}>{children}</a>
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
}

export default Button;
