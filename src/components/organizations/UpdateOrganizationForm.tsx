import { FormEvent, useCallback, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useStorage } from 'reactfire';
import { Trans, useTranslation } from 'next-i18next';

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

  const oldLogoUrl = organization?.logoURL || null;
  const onLogoCleared = () => setLogoIsDirty(true);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!organization) {
        return;
      }

      void (async () => {
        const data = new FormData(event.currentTarget);

        const name = data.get(`name`) as string;
        const timezone = data.get(`timezone`) as string;
        const logoFile = data.get(`logo`) as File | null;

        const logoName = logoFile?.name;

        const logoURL = logoName
          ? await uploadLogo({
              logo: logoFile,
              storage,
              organizationId: organization.id,
            })
          : oldLogoUrl;

        const isLogoRemoved = logoIsDirty && !logoName;

        // delete existing logo if different
        if (isLogoRemoved && oldLogoUrl) {
          try {
            await deleteObject(ref(storage, oldLogoUrl));
          } catch (e) {
            // old logo not found
          }
        }

        const organizationData: WithId<Partial<Organization>> = {
          id: organization.id,
          name,
          timezone,
          logoURL: isLogoRemoved ? null : logoURL,
        };

        const promise = updateOrganization(organizationData);

        await toast.promise(promise, {
          loading: t(`updateOrganizationLoadingMessage`),
          success: t(`updateOrganizationSuccessMessage`),
          error: t(`updateOrganizationErrorMessage`),
        });

        setOrganization({
          ...organization,
          ...organizationData,
        });
      })();
    },
    [
      logoIsDirty,
      oldLogoUrl,
      organization,
      setOrganization,
      storage,
      t,
      updateOrganization,
    ]
  );

  return (
    <form onSubmit={onSubmit} className={'space-y-4'}>
      <div className={'flex flex-col space-y-4'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'organization:organizationNameInputLabel'} />

            <TextField.Input
              data-cy={'organization-name-input'}
              required
              defaultValue={organization?.name}
              name={'name'}
              placeholder={'ex. IndieCorp'}
            />
          </TextField.Label>
        </TextField>

        <Label>
          <Trans i18nKey={'organization:organizationLogoInputLabel'} />

          <ImageUploadInput
            name={'logo'}
            image={oldLogoUrl}
            onClear={onLogoCleared}
          >
            <Trans i18nKey={'common:imageInputLabel'} />
          </ImageUploadInput>
        </Label>

        <Button data-cy={'update-organization-submit-button'} loading={loading}>
          <Trans i18nKey={'organization:updateOrganizationSubmitLabel'} />
        </Button>
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
  await uploadBytes(fileRef, bytes);

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

export default UpdateOrganizationForm;
