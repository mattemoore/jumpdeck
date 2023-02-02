import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Transition } from '@headlessui/react';
import Label from './Label';
import If from '~/core/ui/If';

type Props = React.InputHTMLAttributes<unknown>;

const Hint: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <span className={`TextFieldHint`}>{children}</span>;
};

const Input = forwardRef<React.ElementRef<'input'>, Props>(
  function TextFieldInputComponent(
    { className, children, defaultValue, ...props },
    ref
  ) {
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
          {...props}
          className={`TextFieldInput flex-1 ${className ?? ''}`}
          ref={ref}
        />
      </div>
    );
  }
);

type TextFieldComponent = React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> & {
  Label: typeof Label;
  Hint: typeof Hint;
  Input: typeof Input;
  Error: typeof ErrorMessage;
};

const TextField: TextFieldComponent = ({ children, className }) => {
  return <div className={`TextField ${className ?? ''}`}>{children}</div>;
};

const ErrorMessage: React.FC<
  { error: Maybe<string> } & React.HTMLAttributes<unknown>
> = ({ error, ...props }) => {
  const shouldDisplay = !!error;

  return (
    <Transition
      show={shouldDisplay}
      appear={shouldDisplay}
      enter="ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-50"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Hint>
        <span {...props} className={'py-0.5 text-red-700 dark:text-red-500'}>
          {error}
        </span>
      </Hint>
    </Transition>
  );
};

TextField.Hint = Hint;
TextField.Label = Label;
TextField.Input = Input;
TextField.Error = ErrorMessage;

export default TextField;
