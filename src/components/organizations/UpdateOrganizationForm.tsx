import { useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useStorage } from 'reactfire';
import { Trans, useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { OrganizationContext } from '~/lib/contexts/organization';
import { useUpdateOrganization } from '~/lib/organizations/hooks/use-update-organization';
import { Organization } from '~/lib/organizations/types/organization';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import ImageUploadInput from '~/core/ui/ImageUploadInput';
import Label from '~/core/ui/Label';

const UpdateOrganizationForm = () => {
  const storage = useStorage();
  const { organization, setOrganization } = useContext(OrganizationContext);
  const [updateOrganization, { loading }] = useUpdateOrganization();

  const [logoIsDirty, setLogoIsDirty] = useState(false);
  const { t } = useTranslation('organization');

  const currentOrganizationName = organization?.name ?? '';
  const currentLogoUrl = organization?.logoURL || null;

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: currentOrganizationName,
      logoURL: currentLogoUrl,
    },
  });

  const onLogoCleared = useCallback(() => {
    setLogoIsDirty(true);
    setValue('logoURL', '');
  }, [setValue]);

  const onSubmit = useCallback(
    async (organizationName: string, logoFile: Maybe<File>) => {
      const organizationId = organization?.id;

      if (!organizationId) {
        return toast.error(t(`updateOrganizationErrorMessage`));
      }

      const logoName = logoFile?.name;

      const logoURL = logoName
        ? await uploadLogo({
            logo: logoFile,
            storage,
            organizationId,
          })
        : currentLogoUrl;

      const isLogoRemoved = logoIsDirty && !logoName;

      // delete existing logo if different
      if (isLogoRemoved && currentLogoUrl) {
        try {
          await deleteObject(ref(storage, currentLogoUrl));
        } catch (e) {
          // old logo not found
        }
      }

      const organizationData: WithId<Partial<Organization>> = {
        id: organization.id,
        name: organizationName,
        logoURL: isLogoRemoved ? null : logoURL,
      };

      const promise = updateOrganization(organizationData).then(() => {
        setOrganization({
          ...organization,
          ...organizationData,
        });
      });

      await toast.promise(promise, {
        loading: t(`updateOrganizationLoadingMessage`),
        success: t(`updateOrganizationSuccessMessage`),
        error: t(`updateOrganizationErrorMessage`),
      });
    },
    [
      logoIsDirty,
      currentLogoUrl,
      organization,
      setOrganization,
      storage,
      t,
      updateOrganization,
    ]
  );

  useEffect(() => {
    reset({
      name: organization?.name,
      logoURL: organization?.logoURL,
    });
  }, [organization, reset]);

  const nameControl = register('name', {
    required: true,
  });

  const logoControl = register('logoURL');

  return (
    <form
      onSubmit={handleSubmit((value) => {
        return onSubmit(value.name, getLogoFile(value.logoURL));
      })}
      className={'space-y-4'}
    >
      <div className={'flex flex-col space-y-4'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'organization:organizationNameInputLabel'} />

            <TextField.Input
              {...nameControl}
              data-cy={'organization-name-input'}
              required
              placeholder={'ex. IndieCorp'}
            />
          </TextField.Label>
        </TextField>

        <Label>
          <Trans i18nKey={'organization:organizationLogoInputLabel'} />

          <ImageUploadInput
            {...logoControl}
            image={currentLogoUrl}
            onClear={onLogoCleared}
          >
            <Trans i18nKey={'common:imageInputLabel'} />
          </ImageUploadInput>
        </Label>

        <div>
          <Button
            className={'w-full md:w-auto'}
            data-cy={'update-organization-submit-button'}
            loading={loading}
          >
            <Trans i18nKey={'organization:updateOrganizationSubmitLabel'} />
          </Button>
        </div>
      </div>
    </form>
  );
};

/**
 * @description Upload file to Storage
 * @param storage
 * @param organizationId
 * @param logo
 */
async function uploadLogo({
  storage,
  organizationId,
  logo,
}: {
  storage: FirebaseStorage;
  organizationId: string;
  logo: File;
}) {
  const path = getLogoStoragePath(organizationId, logo.name);
  const bytes = await logo.arrayBuffer();
  const fileRef = ref(storage, path);

  // first, we upload the logo to Firebase Storage
  await uploadBytes(fileRef, bytes, {
    contentType: logo.type,
  });

  // now we can get the download URL from its reference
  return await getDownloadURL(fileRef);
}

/**
 *
 * @param organizationId
 * @param fileName
 */
function getLogoStoragePath(organizationId: string, fileName: string) {
  return [`/organizations`, organizationId, fileName].join('/');
}

function getLogoFile(value: string | null | FileList) {
  if (!value || typeof value === 'string') {
    return;
  }

  return value.item(0) ?? undefined;
}

export default UpdateOrganizationForm;
