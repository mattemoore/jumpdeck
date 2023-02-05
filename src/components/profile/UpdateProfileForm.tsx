import { useCallback, useEffect, useState } from 'react';
import { useStorage } from 'reactfire';
import type { User } from 'firebase/auth';
import { Trans, useTranslation } from 'next-i18next';
import toaster from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  FirebaseStorage,
} from 'firebase/storage';

import { PhoneAuthProvider, unlink } from 'firebase/auth';

import configuration from '~/configuration';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useRequestState } from '~/core/hooks/use-request-state';

import { useUpdateProfile } from '~/lib/profile/hooks/use-update-profile';
import LinkPhoneNumberModal from '~/components/profile/accounts/LinkPhoneNumberModal';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import ImageUploadInput from '~/core/ui/ImageUploadInput';
import If from '~/core/ui/If';
import Modal from '~/core/ui/Modal';

interface ProfileData {
  photoURL?: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
}

function UpdateProfileForm({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (user: ProfileData) => void;
}) {
  const [updateProfile, { loading }] = useUpdateProfile();

  const [displayUpdatePhoneNumber, setDisplayUpdatePhoneNumber] =
    useState(false);

  const storage = useStorage();
  const { t } = useTranslation();

  const currentPhotoURL = user?.photoURL ?? '';
  const currentDisplayName = user?.displayName ?? '';
  const currentPhoneNumber = user?.phoneNumber ?? '';

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      displayName: currentDisplayName,
      photoURL: '',
    },
  });

  const [avatarIsDirty, setAvatarIsDirty] = useState(false);

  const onAvatarCleared = useCallback(() => {
    setAvatarIsDirty(true);
    setValue('photoURL', '');
  }, [setValue]);

  const onSubmit = async (displayName: string, photoFile: Maybe<File>) => {
    const photoName = photoFile?.name;

    const photoUrl = photoName
      ? await uploadUserProfilePhoto(storage, photoFile, user.uid)
      : currentPhotoURL;

    const isAvatarRemoved = avatarIsDirty && !photoName;

    const info = {
      displayName,
      photoURL: isAvatarRemoved ? '' : photoUrl,
    };

    // delete existing photo if different
    if (isAvatarRemoved && currentPhotoURL) {
      try {
        await deleteObject(ref(storage, currentPhotoURL));
      } catch (e) {
        // old photo not found
      }
    }

    const promise = updateProfile(info).then(() => {
      onUpdate(info);
    });

    return toaster.promise(promise, {
      success: t(`profile:updateProfileSuccess`),
      error: t(`profile:updateProfileError`),
      loading: t(`profile:updateProfileLoading`),
    });
  };

  const displayNameControl = register('displayName', {
    value: currentDisplayName,
  });

  const photoURLControl = register('photoURL');

  useEffect(() => {
    reset({
      displayName: currentDisplayName ?? '',
      photoURL: currentPhotoURL ?? '',
    });
  }, [currentDisplayName, currentPhotoURL, reset]);

  return (
    <>
      <form
        data-cy={'update-profile-form'}
        onSubmit={handleSubmit((value) => {
          return onSubmit(value.displayName, getPhotoFile(value.photoURL));
        })}
      >
        <div className={'flex flex-col space-y-4'}>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:displayNameLabel'} />

              <TextField.Input
                {...displayNameControl}
                data-cy={'profile-display-name'}
                minLength={2}
                placeholder={''}
              />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:profilePictureLabel'} />

              <ImageUploadInput
                {...photoURLControl}
                multiple={false}
                onClear={onAvatarCleared}
                image={currentPhotoURL}
              >
                <Trans i18nKey={'common:imageInputLabel'} />
              </ImageUploadInput>
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:emailLabel'} />

              <TextField.Input disabled value={user.email ?? ''} />
            </TextField.Label>

            <If condition={user.email}>
              <div>
                <Button
                  type={'button'}
                  color={'transparent'}
                  size={'small'}
                  href={configuration.paths.settings.email}
                >
                  <span className={'text-xs font-normal'}>
                    <Trans i18nKey={'profile:updateEmailSubmitLabel'} />
                  </span>
                </Button>
              </div>
            </If>

            <If condition={!user.email}>
              <div>
                <Button
                  type={'button'}
                  color={'transparent'}
                  size={'small'}
                  href={configuration.paths.settings.authentication}
                >
                  <span className={'text-xs font-normal'}>
                    <Trans i18nKey={'profile:addEmailAddress'} />
                  </span>
                </Button>
              </div>
            </If>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:phoneNumberLabel'} />

              <TextField.Input disabled value={currentPhoneNumber} />
            </TextField.Label>

            {/* Only show this if phone number is enabled */}
            <If condition={configuration.auth.providers.phoneNumber}>
              <div>
                <If
                  condition={!currentPhoneNumber}
                  fallback={
                    <RemovePhoneNumberButton
                      user={user}
                      onSuccess={() => {
                        onUpdate({
                          phoneNumber: null,
                        });
                      }}
                    />
                  }
                >
                  <AddPhoneNumberButton
                    onClick={() => setDisplayUpdatePhoneNumber(true)}
                  />
                </If>
              </div>
            </If>
          </TextField>

          <div>
            <Button className={'w-full md:w-auto'} loading={loading}>
              <Trans i18nKey={'profile:updateProfileSubmitLabel'} />
            </Button>
          </div>
        </div>
      </form>

      <If condition={displayUpdatePhoneNumber}>
        <LinkPhoneNumberModal
          isOpen={true}
          setIsOpen={setDisplayUpdatePhoneNumber}
          onSuccess={(phoneNumber) => {
            onUpdate({
              phoneNumber,
            });
          }}
        />
      </If>
    </>
  );
}

/**
 * @name getPhotoFile
 * @param value
 * @description Returns the file of the photo when submitted
 * It returns undefined when the user hasn't selected a file
 */
function getPhotoFile(value: string | null | FileList) {
  if (!value || typeof value === 'string') {
    return;
  }

  return value.item(0) ?? undefined;
}

async function uploadUserProfilePhoto(
  storage: FirebaseStorage,
  photoFile: File,
  userId: string
) {
  const url = `/profiles/${userId}/${photoFile.name}`;
  const bytes = await photoFile.arrayBuffer();
  const fileRef = ref(storage, url);

  await uploadBytes(fileRef, bytes, {
    contentType: photoFile.type,
  });

  return await getDownloadURL(fileRef);
}

function RemovePhoneNumberButton({
  user,
  onSuccess,
}: React.PropsWithChildren<{
  user: User;
  onSuccess: () => void;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requestState = useRequestState();
  const { t } = useTranslation();

  const onUnlinkPhoneNumber = useCallback(() => {
    const promise = unlink(user, PhoneAuthProvider.PROVIDER_ID)
      .then(() => {
        setIsModalOpen(false);
        onSuccess();
      })
      .catch((error) => {
        requestState.setError(error);

        throw getFirebaseErrorCode(error);
      });

    requestState.setLoading(true);

    return toaster.promise(promise, {
      loading: t(`profile:unlinkActionLoading`),
      success: t(`profile:unlinkActionSuccess`),
      error: t(`profile:unlinkActionError`),
    });
  }, [user, requestState, t, onSuccess]);

  return (
    <>
      <Button
        type={'button'}
        color={'transparent'}
        size={'small'}
        onClick={() => setIsModalOpen(true)}
      >
        <span className={'text-xs font-normal'}>
          <Trans i18nKey={'profile:removePhoneNumber'} />
        </span>
      </Button>

      <Modal
        heading={<Trans i18nKey={'profile:removePhoneNumber'} />}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        <div className={'flex flex-col space-y-3'}>
          <div>
            <Trans i18nKey={'profile:confirmRemovePhoneNumberDescription'} />
          </div>

          <div>
            <Trans i18nKey={'common:modalConfirmationQuestion'} />
          </div>

          <If condition={requestState.state.error}>
            {(error) => <AuthErrorMessage error={error as string} />}
          </If>

          <Button
            block
            loading={requestState.state.loading}
            color={'danger'}
            onClick={onUnlinkPhoneNumber}
          >
            <Trans i18nKey={'profile:confirmRemovePhoneNumber'} />
          </Button>
        </div>
      </Modal>
    </>
  );
}

function AddPhoneNumberButton(
  props: React.PropsWithChildren<{
    onClick: EmptyCallback;
  }>
) {
  return (
    <Button
      type={'button'}
      color={'transparent'}
      size={'small'}
      onClick={props.onClick}
    >
      <span className={'text-xs font-normal'}>
        <Trans i18nKey={'profile:addPhoneNumber'} />
      </span>
    </Button>
  );
}

export default UpdateProfileForm;
