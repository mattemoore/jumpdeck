import React, { LegacyRef } from 'react';
import Label from './Label';

type Props = React.InputHTMLAttributes<unknown> & {
  innerRef?: LegacyRef<HTMLInputElement>;
};

const Hint: React.FC = ({ children }) => {
  return <span className={`TextFieldHint`}>{children}</span>;
};

const Input: React.FC<Props> = ({ className, innerRef, ...props }) => {
  return (
    <input
      className={`TextFieldInput  ${className ?? ''}`}
      {...props}
      ref={innerRef}
    />
  );
};

type TextFieldComponent = React.FC<Props> & {
  Label: typeof Label;
  Hint: typeof Hint;
  Input: typeof Input;
};

const TextField: TextFieldComponent = ({ children }) => {
  return <div className={'TextField'}>{children}</div>;
};

TextField.Hint = Hint;
TextField.Label = Label;
TextField.Input = Input;

export default TextField;
