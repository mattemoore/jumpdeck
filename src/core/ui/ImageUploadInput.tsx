import React, {
  createRef,
  FormEvent,
  LegacyRef,
  MouseEventHandler,
  useState,
} from 'react';

import Image from 'next/image';

import CloudUploadIcon from '@heroicons/react/outline/CloudUploadIcon';
import XIcon from '@heroicons/react/outline/XIcon';

import Label from '~/core/ui/Label';
import If from '~/core/ui/If';
import IconButton from '~/core/ui/IconButton';

type Props = Omit<React.InputHTMLAttributes<unknown>, 'value'> & {
  innerRef?: LegacyRef<HTMLInputElement>;
  image?: string | null;
  onClear?: () => void;
};

const ImageUploadInput: React.FC<Props> = ({
  children,
  image,
  onClear,
  ...props
}) => {
  const [value, setValue] = useState<string | null>(image ?? null);
  const [fileName, setFileName] = useState<string>('');
  const ref = createRef<HTMLInputElement>();

  const onInput = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.currentTarget.files;

    if (files?.length) {
      const file = files[0];
      const data = URL.createObjectURL(file);

      setValue(data);
      setFileName(file.name);
    }

    if (props.onInput) {
      props.onInput(e);
    }
  };

  const imageRemoved: MouseEventHandler = (e) => {
    e.preventDefault();

    setValue('');
    setFileName('');

    if (ref.current) {
      ref.current.value = '';
    }

    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={'ImageUploadInput'}>
      <input
        {...props}
        ref={ref}
        className={'hidden'}
        type={'file'}
        onInput={onInput}
        accept="image/*"
      />

      <div className={'flex space-x-4 items-center'}>
        <div className={'flex'}>
          <If condition={!value}>
            <CloudUploadIcon
              className={'h-5 text-gray-500 dark:text-black-100'}
            />
          </If>

          <If condition={value}>
            <Image
              objectFit={'contain'}
              width={'18'}
              height={'18'}
              src={value as string}
              alt={props.alt}
            />
          </If>
        </div>

        <If condition={!value}>
          <div className={'flex flex-auto'}>
            <Label as={'span'} className={'cursor-pointer text-xs'}>
              {children}
            </Label>
          </div>
        </If>

        <If condition={value as string}>
          <div className={'flex flex-auto'}>
            <If
              condition={fileName}
              fallback={
                <Label
                  as={'span'}
                  className={'cursor-pointer text-xs ellipsify'}
                >
                  {children}
                </Label>
              }
            >
              <Label as="span" className={'text-xs ellipsify'}>
                {fileName}
              </Label>
            </If>
          </div>
        </If>

        <If condition={value}>
          <IconButton onClick={imageRemoved}>
            <XIcon className="h-3 w-3" />
          </IconButton>
        </If>
      </div>
    </div>
  );
};

export default ImageUploadInput;
