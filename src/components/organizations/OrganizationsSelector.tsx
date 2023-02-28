import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Trans } from 'next-i18next';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { Organization } from '~/lib/organizations/types/organization';
import { useFetchUserOrganizations } from '~/lib/organizations/hooks/use-fetch-user-organizations';
import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';

import If from '~/core/ui/If';
import CreateOrganizationModal from './CreateOrganizationModal';

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectSeparator,
  SelectGroup,
  SelectAction,
  SelectLabel,
  SelectValue,
} from '~/core/ui/Select';

import ClientOnly from '~/core/ui/ClientOnly';

const OrganizationsSelector: React.FCC<{ userId: string }> = ({ userId }) => {
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const router = useRouter();
  const organization = useCurrentOrganization();

  const value = getDeepLinkPath(organization?.id as string, router.asPath);

  return (
    <>
      <Select
        open={isSelectOpen}
        onOpenChange={setIsSelectOpen}
        value={value}
        onValueChange={(path) => {
          return router.push(path);
        }}
      >
        <SelectTrigger
          data-cy={'organization-selector'}
          className={'!bg-transparent'}
        >
          <span
            className={'max-w-[5rem] text-sm lg:max-w-[12rem] lg:text-base'}
          >
            <OrganizationItem organization={organization} />

            <span hidden>
              <SelectValue />
            </span>
          </span>
        </SelectTrigger>

        <SelectContent position={'popper'}>
          <SelectGroup>
            <SelectLabel>Your Organizations</SelectLabel>

            <SelectSeparator />

            <ClientOnly>
              <OrganizationsOptions
                organization={organization}
                userId={userId}
              />
            </ClientOnly>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectAction
              onClick={() => {
                setIsSelectOpen(false);
                setIsOrganizationModalOpen(true);
              }}
            >
              <span
                data-cy={'create-organization-button'}
                className={'flex flex-row items-center space-x-2 truncate'}
              >
                <PlusCircleIcon className={'h-5'} />

                <span>
                  <Trans
                    i18nKey={'organization:createOrganizationDropdownLabel'}
                  />
                </span>
              </span>
            </SelectAction>
          </SelectGroup>
        </SelectContent>
      </Select>

      <CreateOrganizationModal
        setIsOpen={setIsOrganizationModalOpen}
        isOpen={isOrganizationModalOpen}
        onCreate={(organizationId) => {
          return router.push(getDeepLinkPath(organizationId, router.asPath));
        }}
      />
    </>
  );
};

function OrganizationsOptions({
  userId,
  organization,
}: React.PropsWithChildren<{
  userId: string;
  organization: Maybe<WithId<Organization>>;
}>) {
  const router = useRouter();
  const { data, status } = useFetchUserOrganizations(userId);
  const isLoading = status === 'loading';

  if (isLoading && organization) {
    const path = getDeepLinkPath(organization?.id as string, router.asPath);

    return (
      <SelectItem value={path} key={organization.id}>
        <OrganizationItem organization={organization} />
      </SelectItem>
    );
  }

  const organizations = data ?? [];

  return (
    <>
      {organizations.map((item) => {
        const path = getDeepLinkPath(item.id, router.asPath);

        return (
          <SelectItem value={path} key={item.id}>
            <OrganizationItem organization={item} />
          </SelectItem>
        );
      })}
    </>
  );
}

function OrganizationItem({
  organization,
}: {
  organization: Maybe<Organization>;
}) {
  const imageSize = 18;

  if (!organization) {
    return null;
  }

  const { logoURL, name } = organization;

  return (
    <span
      data-cy={'organization-selector-item'}
      className={`flex max-w-[12rem] items-center space-x-2`}
    >
      <If condition={logoURL}>
        <span className={'flex items-center'}>
          <Image
            style={{
              width: imageSize,
              height: imageSize,
            }}
            width={imageSize}
            height={imageSize}
            alt={`${name} Logo`}
            className={'object-contain'}
            src={logoURL as string}
          />
        </span>
      </If>

      <span className={'w-auto truncate text-sm font-medium'}>{name}</span>
    </span>
  );
}

function getDeepLinkPath(organizationId: string, path: string) {
  return ['', organizationId, path.slice(1, path.length)].join('/');
}

export default OrganizationsSelector;
