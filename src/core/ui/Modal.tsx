import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { Trans } from 'next-i18next';

import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';

import Button from './Button';

const Modal: React.FC<
  React.PropsWithChildren<{
    heading: string | JSX.Element;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => unknown;
    closeButton?: boolean;
  }>
> = ({ isOpen, setIsOpen, closeButton, heading, children }) => {
  const useCloseButton = closeButton ?? true;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        as="div"
        className="fixed inset-0 z-10 h-screen bg-gray-500 bg-opacity-30 transition-all"
        onClose={() => setIsOpen(false)}
      >
        <div className="h-full min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-70"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-80"
          >
            <div className="my-4 inline-block max-h-[90%] w-full max-w-xl transform overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black-400">
              <div className="flex items-center">
                <Dialog.Title
                  as="h2"
                  className="flex w-full text-2xl font-bold leading-4 text-current"
                >
                  {heading}
                </Dialog.Title>

                <div className={'justify-end'}>
                  <IconButton
                    label={'Close Modal'}
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className={'h-6'} />
                  </IconButton>
                </div>
              </div>

              <div className="relative mt-4">{children}</div>

              <If condition={useCloseButton}>
                <div className="mt-2">
                  <Button
                    data-cy={'close-modal-button'}
                    block
                    color={'secondary'}
                    onClick={() => setIsOpen(false)}
                  >
                    <Trans i18nKey={'common:cancel'} />
                  </Button>
                </div>
              </If>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
