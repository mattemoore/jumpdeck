import { useCallback, useState } from 'react';
import toaster from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

import { useDeleteInvite } from '~/lib/organizations/hooks/use-delete-invite';

import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';
import Modal from '~/core/ui/Modal';
import Button from '~/core/ui/Button';

const DeleteInviteButton: React.FCC<{
  inviteId: string;
  organizationId: string;
  memberEmail: string;
}> = ({ inviteId, organizationId, memberEmail }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteRequest = useDeleteInvite();
  const { t } = useTranslation('organization');

  const onInviteDeleteRequested = useCallback(() => {
    void (async () => {
      try {
        const promise = deleteRequest(organizationId, inviteId);

        await toaster.promise(promise, {
          success: t(`deleteInviteSuccessMessage`),
          error: t(`deleteInviteErrorMessage`),
          loading: t(`deleteInviteLoadingMessage`),
        });

        setIsDeleting(false);
      } catch (e) {
        setIsDeleting(false);
      }
    })();
  }, [deleteRequest, inviteId, organizationId, t]);

  const heading = <Trans i18nKey={'organization:deleteInviteModalHeading'} />;

  return (
    <>
      <IconButton
        data-cy={'delete-invite-button'}
        label={'Delete Invite'}
        onClick={() => setIsDeleting(true)}
      >
        <XMarkIcon className={'h-6'} />
      </IconButton>

      <If condition={isDeleting}>
        <Modal heading={heading} isOpen={isDeleting} setIsOpen={setIsDeleting}>
          <div className={'flex flex-col space-y-4'}>
            <p>
              <Trans
                i18nKey={'organization:confirmDeletingMemberInvite'}
                values={{ email: memberEmail }}
                components={{ b: <b /> }}
              />
            </p>

            <p>
              <Trans i18nKey={'common:modalConfirmationQuestion'} />
            </p>

            <Button
              data-cy={'confirm-delete-invite-button'}
              color={'danger'}
              onClick={onInviteDeleteRequested}
            >
              <Trans i18nKey={'organization:deleteInviteSubmitLabel'} />
            </Button>
          </div>
        </Modal>
      </If>
    </>
  );
};

export default DeleteInviteButton;
