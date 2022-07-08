import { FormEvent, useCallback, useState } from 'react';
import { useStorage } from 'reactfire';
import type { User } from 'firebase/auth';
import { Trans, useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  FirebaseStorage,
} from 'firebase/storage';

import { useUpdateProfile } from '~/lib/profile/hooks/use-update-profile';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import ImageUploadInput from '~/core/ui/ImageUploadInput';

interface ProfileData {
  photoURL: string | null;
  displayName: string | null;
}

function UpdateProfileForm({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate?: (user: ProfileData) => void;
}) {
  const [updateProfile, { loading }] = useUpdateProfile();
  const storage = useStorage();
  const { t } = useTranslation();
  const [avatarIsDirty, setAvatarIsDirty] = useState(false);

  const currentDisplayName = user?.displayName ?? '';
  const currentPhotoURL = user?.photoURL;

  const onAvatarCleared = () => setAvatarIsDirty(true);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      void (async () => {
        const data = new FormData(event.currentTarget);
        const displayName = (data.get('displayName') as string) ?? '';
        const photoFile = data.get('photoUrl') as Maybe<File>;

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

        const promise = updateProfile(info);

        await toast.promise(promise, {
          success: t(`profile:updateProfileSuccess`),
          error: t(`profile:updateProfileError`),
          loading: t(`profile:updateProfileLoading`),
        });

        if (onUpdate) {
          onUpdate(info);
        }
      })();
    },
    [
      avatarIsDirty,
      currentPhotoURL,
      onUpdate,
      storage,
      t,
      updateProfile,
      user.uid,
    ]
  );

  return (
    <form onSubmit={onSubmit}>
      <div className={'flex flex-col space-y-4'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:displayNameLabel'} />

            <TextField.Input
              name={'displayName'}
              placeholder={'Name'}
              defaultValue={currentDisplayName}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:profilePictureLabel'} />

            <ImageUploadInput
              onClear={onAvatarCleared}
              name={'photoUrl'}
              image={user?.photoURL ?? ''}
            >
              <Trans i18nKey={'common:imageInputLabel'} />
            </ImageUploadInput>
          </TextField.Label>
        </TextField>

        <Button block loading={loading}>
          <Trans i18nKey={'profile:updateProfileSubmitLabel'} />
        </Button>
      </div>
    </form>
  );
}

async function uploadUserProfilePhoto(
  storage: FirebaseStorage,
  photoFile: File,
  userId: string
) {
  const url = `/profiles/${userId}/${photoFile.name}`;
  const bytes = await photoFile.arrayBuffer();
  const fileRef = ref(storage, url);

  await uploadBytes(fileRef, bytes);

  return await getDownloadURL(fileRef);
}

export default UpdateProfileForm;
