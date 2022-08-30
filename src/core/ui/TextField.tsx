import React, {
  createRef,
  LegacyRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

import Label from './Label';
import If from '~/core/ui/If';
import IconButton from '~/core/ui/IconButton';
import classNames from 'classnames';

type Props = React.InputHTMLAttributes<unknown> & {
  innerRef?: RefObject<HTMLInputElement> | LegacyRef<HTMLInputElement>;
  useResetButton?: boolean;
  onClear?: EmptyCallback;
  onValueChange?: (value: string | number | readonly string[]) => void;
};

const Hint: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <span className={`TextFieldHint`}>{children}</span>;
};

const Input: React.FC<Props> = ({
  className,
  innerRef,
  children,
  useResetButton,
  onClear,
  defaultValue,
  onValueChange,
  ...props
}) => {
  const ref = innerRef ?? createRef<HTMLInputElement>();
  const currentValue = props.value;
  const [value, setValue] = useState(currentValue);

  const onReset = useCallback(() => {
    if (ref) {
      setValue('');

      if (onClear) {
        onClear();
      }
    }
  }, [onClear, ref]);

  const shouldShowResetButton = useMemo(() => {
    return Boolean(useResetButton && value);
  }, [value, useResetButton]);

  const onChange: React.FormEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (props.onChange) {
        props.onChange(event);
      }

      const nextValue = event.currentTarget.value ?? '';

      if (onValueChange) {
        onValueChange(nextValue);
      }

      setValue(nextValue);
    },
    [onValueChange, props]
  );

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue, onValueChange]);

  return (
    <div
      className={classNames(`TextFieldInputContainer`, className, {
        [`TextFieldInputContainerDisabled`]: props.disabled,
      })}
    >
      <If condition={children}>
        <span className={'flex pl-2.5'}>{children}</span>
      </If>

      <input
        value={innerRef ? undefined : value}
        defaultValue={defaultValue}
        className={`TextFieldInput flex-1 ${className ?? ''}`}
        {...props}
        ref={ref}
        onChange={onChange}
      />

      <If condition={shouldShowResetButton}>
        <div className={'flex pr-2.5'}>
          <IconButton type={'button'} onClick={onReset}>
            <XMarkIcon className={'h-5'} />
          </IconButton>
        </div>
      </If>
    </div>
  );
};

type TextFieldComponent = React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> & {
  Label: typeof Label;
  Hint: typeof Hint;
  Input: typeof Input;
};

const TextField: TextFieldComponent = ({ children, className }) => {
  return <div className={`TextField ${className ?? ''}`}>{children}</div>;
};

TextField.Hint = Hint;
TextField.Label = Label;
TextField.Input = Input;

export default TextField;
