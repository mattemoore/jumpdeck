import { useCallback, useState } from 'react';
import { useStorage } from 'reactfire';
import type { User } from 'firebase/auth';
import { Trans, useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

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
  onUpdate: (user: ProfileData) => void;
}) {
  const [updateProfile, { loading }] = useUpdateProfile();

  const storage = useStorage();
  const { t } = useTranslation();

  const currentPhotoURL = user?.photoURL ?? '';
  const currentDisplayName = user?.displayName ?? '';

  const { register, handleSubmit } = useForm({
    defaultValues: {
      displayName: currentDisplayName,
      photoURL: '',
    },
  });

  const [avatarIsDirty, setAvatarIsDirty] = useState(false);

  const onAvatarCleared = useCallback(() => {
    setAvatarIsDirty(true);
  }, []);

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

    return toast.promise(promise, {
      success: t(`profile:updateProfileSuccess`),
      error: t(`profile:updateProfileError`),
      loading: t(`profile:updateProfileLoading`),
    });
  };

  const displayNameControl = register('displayName', {
    value: currentDisplayName,
  });

  const photoURLControl = register('photoURL');

  return (
    <form
      data-cy={'update-profile-form'}
      onSubmit={handleSubmit((value) => {
        const photoFileList = value.photoURL as unknown as FileList;
        const photoFile = photoFileList ? photoFileList.item(0) : undefined;

        return onSubmit(value.displayName, photoFile ?? undefined);
      })}
    >
      <div className={'flex flex-col space-y-4'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:displayNameLabel'} />

            <TextField.Input
              innerRef={displayNameControl.ref}
              onChange={displayNameControl.onChange}
              onBlur={displayNameControl.onBlur}
              name={displayNameControl.name}
              data-cy={'profile-display-name'}
              minLength={2}
              placeholder={''}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:emailLabel'} />

            <TextField.Input disabled value={user.email ?? ''} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:profilePictureLabel'} />

            <ImageUploadInput
              multiple={false}
              onClear={onAvatarCleared}
              name={photoURLControl.name}
              image={currentPhotoURL}
              onChange={photoURLControl.onChange}
              onBlur={photoURLControl.onBlur}
              innerRef={photoURLControl.ref}
            >
              <Trans i18nKey={'common:imageInputLabel'} />
            </ImageUploadInput>
          </TextField.Label>
        </TextField>

        <div>
          <Button className={'w-full md:w-auto'} loading={loading}>
            <Trans i18nKey={'profile:updateProfileSubmitLabel'} />
          </Button>
        </div>
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
