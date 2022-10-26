import React, {
  FormEvent,
  MouseEventHandler,
  RefCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

import Label from '~/core/ui/Label';
import If from '~/core/ui/If';
import IconButton from '~/core/ui/IconButton';

type Props = Omit<React.InputHTMLAttributes<unknown>, 'value'> & {
  innerRef?: RefCallback<HTMLInputElement>;
  image?: string | null;
  onClear?: () => void;
};

const IMAGE_SIZE = 22;

const ImageUploadInput: React.FCC<Props> = ({
  children,
  image,
  onClear,
  innerRef,
  ...props
}) => {
  const propValue = image ?? null;
  const [value, setValue] = useState<string | null>(propValue);
  const [fileName, setFileName] = useState<string>('');
  const ref = useRef<HTMLInputElement>();

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

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  return (
    <div className={'ImageUploadInput'}>
      <input
        {...props}
        ref={(inputRef) => {
          ref.current = inputRef ?? undefined;

          if (innerRef) {
            innerRef(inputRef);
          }
        }}
        className={'hidden'}
        type={'file'}
        onInput={onInput}
        accept="image/*"
      />

      <div className={'flex items-center space-x-4'}>
        <div className={'flex'}>
          <If condition={!value}>
            <CloudArrowUpIcon
              className={'h-5 text-gray-500 dark:text-black-100'}
            />
          </If>

          <If condition={value}>
            <Image
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
              }}
              className={'object-contain'}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              src={value as string}
              alt={props.alt ?? ''}
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
            <XMarkIcon className="h-3 w-3" />
          </IconButton>
        </If>
      </div>
    </div>
  );
};

export default ImageUploadInput;
