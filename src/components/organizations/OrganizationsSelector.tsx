import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { setCookie } from 'nookies';
import { Trans } from 'next-i18next';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { Organization } from '~/lib/organizations/types/organization';
import { useFetchUserOrganizations } from '~/lib/organizations/hooks/use-fetch-user-organizations';
import { OrganizationContext } from '~/lib/contexts/organization';

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
  const { organization, setOrganization } = useContext(OrganizationContext);
  const organizationsRef = useRef<Array<WithId<Organization>>>([]);

  const onOrganizationsLoaded = useCallback(
    (organizations: Array<WithId<Organization>>) => {
      organizationsRef.current = organizations;
    },
    []
  );

  const onChange = useCallback(
    (organization: WithId<Organization>) => {
      // update the global Organization context
      // with the selected organization
      setOrganization(organization);

      // we save the selected organization in
      // a cookie so that we can return to it when
      // the user refreshes or navigates elsewhere
      saveOrganizationIdInCookie(organization.id);
    },
    [setOrganization]
  );

  const organizationSelected = useCallback(
    (organizationId: string) => {
      if (organizationId === organization?.id) {
        return;
      }

      const selectedOrganization = organizationsRef.current.find(
        ({ id }) => id === organizationId
      );

      if (selectedOrganization) {
        onChange(selectedOrganization);
      }
    },
    [onChange, organization?.id]
  );

  return (
    <>
      <Select
        open={isSelectOpen}
        onOpenChange={setIsSelectOpen}
        onValueChange={organizationSelected}
        value={organization?.id}
      >
        <SelectTrigger data-cy={'organization-selector'}>
          <span
            className={'max-w-[5rem] text-sm lg:max-w-[12rem] lg:text-base'}
          >
            <OrganizationItem organization={organization} />

            <span hidden>
              <SelectValue />
            </span>
          </span>
        </SelectTrigger>

        <SelectContent position={'popper'} collisionPadding={{ top: 100 }}>
          <SelectGroup>
            <SelectLabel>Your Organizations</SelectLabel>

            <SelectSeparator />

            <ClientOnly>
              <OrganizationsOptions
                onLoad={onOrganizationsLoaded}
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
        onCreate={onChange}
      />
    </>
  );
};

function OrganizationsOptions({
  userId,
  onLoad,
  organization,
}: React.PropsWithChildren<{
  userId: string;
  organization: Maybe<WithId<Organization>>;
  onLoad: (organizations: Array<WithId<Organization>>) => void;
}>) {
  const { data, status } = useFetchUserOrganizations(userId);
  const isLoading = status === 'loading';

  useEffect(() => {
    if (data) {
      onLoad(data);
    }
  }, [data, onLoad]);

  if (isLoading && organization) {
    return (
      <SelectItem value={organization.id} key={organization.id}>
        <OrganizationItem organization={organization} />
      </SelectItem>
    );
  }

  const organizations = data ?? [];

  return (
    <>
      {organizations.map((organization) => (
        <SelectItem value={organization.id} key={organization.id}>
          <OrganizationItem organization={organization} />
        </SelectItem>
      ))}
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

function saveOrganizationIdInCookie(organizationId: string) {
  const cookieName = `organizationId`;
  const path = '/';

  setCookie(undefined, cookieName, organizationId, { path });
}

export default OrganizationsSelector;
