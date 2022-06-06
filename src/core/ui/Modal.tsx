import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import XIcon from '@heroicons/react/outline/XIcon';
import { Trans } from 'next-i18next';

import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';

import Button from './Button';

const Modal: React.FCC<{
  heading: React.FCC | string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
  closeButton?: boolean;
}> = ({ isOpen, setIsOpen, closeButton, heading, children }) => {
  const useCloseButton = closeButton ?? true;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-30 transition-all"
        onClose={() => setIsOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
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

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black-400">
              <div className="flex items-center">
                <Dialog.Title
                  as="h2"
                  className="flex w-full text-2xl font-semibold leading-4 text-current"
                >
                  <>{heading}</>
                </Dialog.Title>

                <div className={'justify-end'}>
                  <IconButton
                    label={'Close Modal'}
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon className={'h-6'} />
                  </IconButton>
                </div>
              </div>

              <div className="mt-4">{children}</div>

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
