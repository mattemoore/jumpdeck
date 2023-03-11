import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { useRecoilState } from 'recoil';
import { signatureImageState } from '~/core/signitto/state/SignatureImageState';
import { type SignatureImageModel } from '~/core/signitto/types/SingatureImageModel';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';

function SignatureLogo(): JSX.Element {
  const [images, setImages] = useRecoilState(signatureImageState);

  // TODO: Remove dupe deep cloning code
  function onClickLogo(): void {
    const currentImages = images.slice();
    const image: SignatureImageModel = { ...currentImages[0] };
    image.url =
      'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80';
    currentImages[0] = image;
    setImages(currentImages);
  }

  function onClickRemove(): void {
    const currentImages = images.slice();
    const image: SignatureImageModel = { ...currentImages[0] };
    image.url = '';
    currentImages[0] = image;
    setImages(currentImages);
  }
  return (
    <>
      <div
        id="avatarButtonContainer"
        className="flex flex-row items-start space-x-3"
      >
        {/* Using radix Avatar instead of Makerkit Avatar as Makerkit Avatar is hard to resize */}
        <Avatar.Root className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-400/80">
          <Avatar.Image
            className="h-full w-full rounded-full object-cover"
            src={images[0].url}
            alt="{"
          />
          <Avatar.Fallback
            className="text-black flex h-full w-full items-center justify-center rounded-full bg-gray-400/80"
            delayMs={600}
          >
            {images[0].label}
          </Avatar.Fallback>
        </Avatar.Root>

        <div className="mt-4 flex flex-col">
          <Button size="small" onClick={onClickLogo}>
            <PlusIcon className="float-left h-5 pr-2" /> Photo
          </Button>
          <div className="pt-1 text-xs">PNG or JPG (max. 800x400px)</div>
        </div>
        <Button
          size={'small'}
          variant={'outline'}
          color={'secondary'}
          onClick={onClickRemove}
          className="mt-4 pt-0.5 text-red-700"
        >
          Remove
        </Button>
      </div>
    </>
  );
}
export default SignatureLogo;
