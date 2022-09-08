import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { SpringSpinner } from 'react-epic-spinners';
import classNames from 'classnames';

import If from '~/core/ui/If';

type Color = 'primary' | 'secondary' | 'transparent' | 'danger' | 'custom';
type Size = 'normal' | 'small' | 'large' | 'custom';
type Variant = `normal` | `outline` | `flat`;

type Props = React.ButtonHTMLAttributes<unknown> &
  React.PropsWithChildren<{
    block?: boolean;
    color?: Color;
    size?: Size;
    variant?: Variant;
    loading?: boolean;
    href?: Maybe<string>;
  }>;

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

  return `${sizes[size]} w-full`;
};

const getVariantClasses = (variant: Variant, color: Color = `primary`) => {
  // cannot be too smart here due to purge-js
  const variants: Record<Variant, Record<Color, string>> = {
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
      secondary: `ButtonSecondaryOutline`,
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

  return variants[variant][color];
};

const Button: React.FCC<Props> = ({
  children,
  color,
  size,
  variant,
  block,
  loading,
  href,
  ...props
}) => {
  const defaultColor: Color = `primary`;
  const defaultSize: Size = `normal`;
  const defaultVariant = `normal`;

  const useColor = color ?? defaultColor;
  const useSize = size ?? defaultSize;
  const useVariant = variant ?? defaultVariant;

  const className = classNames(
    `Button`,
    getColorClasses(useColor),
    getVariantClasses(useVariant, useColor),
    block ? `w-full` : ``,
    loading ? `opacity-70` : ``,
    props.className ?? ''
  );

  return (
    <button
      {...props}
      className={className}
      disabled={loading || props.disabled}
    >
      <InnerButtonContainerElement
        href={href}
        className={getSizeClasses(useSize)}
      >
        <span className={`flex w-full flex-1 items-center justify-center`}>
          <If condition={loading}>
            <Animation />
          </If>

          {children}
        </span>
      </InnerButtonContainerElement>
    </button>
  );
};

function Animation() {
  return (
    <span className={'mx-2'}>
      <SpringSpinner
        className={'mx-auto'}
        color={'currentColor'}
        size={20}
        animationDuration={2000}
      />
    </span>
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
        <a className={`${className} flex w-full items-center`}>{children}</a>
      </Link>
    );
  }

  return (
    <span className={`${className} flex w-full items-center`}>{children}</span>
  );
}

export default Button;
