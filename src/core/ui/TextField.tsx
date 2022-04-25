import React, {
  createRef,
  LegacyRef,
  RefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { XIcon } from '@heroicons/react/outline';

import Label from './Label';
import If from '~/core/ui/If';
import IconButton from '~/core/ui/IconButton';

type Props = React.InputHTMLAttributes<unknown> & {
  innerRef?: RefObject<HTMLInputElement> | LegacyRef<HTMLInputElement>;
  useResetButton?: boolean;
  onClear?: EmptyCallback;
};

const Hint: React.FC = ({ children }) => {
  return <span className={`TextFieldHint`}>{children}</span>;
};

const Input: React.FC<Props> = ({
  className,
  innerRef,
  children,
  useResetButton,
  onClear,
  ...props
}) => {
  const ref = innerRef ?? createRef<HTMLInputElement>();
  const [value, setValue] = useState<string>();

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

      setValue(event.currentTarget.value ?? '');
    },
    [props]
  );

  return (
    <div className={`TextFieldInputContainer ${className ?? ''}`}>
      <span className={'flex pl-2.5'}>{children}</span>

      <input
        value={value}
        className={`TextFieldInput flex-1 ${className ?? ''}`}
        {...props}
        ref={ref}
        onChange={onChange}
      />

      <If condition={shouldShowResetButton}>
        <div className={'flex pr-2.5'}>
          <IconButton type={'button'} onClick={onReset}>
            <XIcon className={'h-5'} />
          </IconButton>
        </div>
      </If>
    </div>
  );
};

type TextFieldComponent = React.FC<Props> & {
  Label: typeof Label;
  Hint: typeof Hint;
  Input: typeof Input;
};

const TextField: TextFieldComponent = ({ children, className }) => {
  return <div className={`TextField ${className}`}>{children}</div>;
};

TextField.Hint = Hint;
TextField.Label = Label;
TextField.Input = Input;

export default TextField;
