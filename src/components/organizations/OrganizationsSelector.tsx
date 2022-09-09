import { useCallback, useContext, useState } from 'react';
import Image from 'next/future/image';
import { useAuth } from 'reactfire';
import { SpringSpinner } from 'react-epic-spinners';

import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

import { setCookie } from 'nookies';
import { Trans } from 'next-i18next';

import { Organization } from '~/lib/organizations/types/organization';
import { useFetchUserOrganizations } from '~/lib/organizations/hooks/use-fetch-user-organizations';
import { useUpdateOrganizationIdToken } from '~/lib/organizations/hooks/use-update-organization-id-token';
import { OrganizationContext } from '~/lib/contexts/organization';

import If from '~/core/ui/If';
import { PopoverDropdown, PopoverDropdownItem } from '~/core/ui/Popover';

import CreateOrganizationModal from './CreateOrganizationModal';

const PopoverButton: React.FCC<{
  organization: Maybe<WithId<Organization>>;
}> = ({ organization }) => {
  if (organization) {
    return <OrganizationItem organization={organization} />;
  }

  return null;
};

const OrganizationsSelector: React.FCC<{ userId: string }> = ({ userId }) => {
  const auth = useAuth();

  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const { organization, setOrganization } = useContext(OrganizationContext);
  const { data: organizations, status } = useFetchUserOrganizations(userId);
  const isLoadingOrganizations = status === `loading`;

  const [updateOrganizationIdToken] = useUpdateOrganizationIdToken();

  // this is called by your component when the organization ID changes
  const updateOrganizationTokenId = useCallback(async () => {
    await updateOrganizationIdToken();
    await auth.currentUser?.getIdTokenResult(true);
  }, [auth.currentUser, updateOrganizationIdToken]);

  const organizationSelected = useCallback(
    async (item: WithId<Organization>) => {
      // update the global Organization context
      // with the selected organization
      setOrganization(item);

      // we save the selected organization in
      // a cookie so that we can return to it when
      // the user refreshes or navigates elsewhere
      saveOrganizationIdInCookie(item.id);

      // update organization ID
      // by updating the user's current auth claims
      // needed for Firebase Storage's rules
      await updateOrganizationTokenId();
    },
    [setOrganization, updateOrganizationTokenId]
  );

  if (isLoadingOrganizations) {
    return <SpringSpinner size={24} color={`currentColor`} />;
  }

  return (
    <>
      <div data-cy={'organization-selector'}>
        <PopoverDropdown button={<PopoverButton organization={organization} />}>
          {(organizations ?? []).map((item) => {
            const isSelected = item.id === organization?.id;

            if (!isSelected) {
              return (
                <PopoverDropdownItem
                  key={item.name}
                  onClick={() => organizationSelected(item)}
                >
                  <PopoverDropdownItem.Label>
                    <OrganizationItem organization={item} />
                  </PopoverDropdownItem.Label>
                </PopoverDropdownItem>
              );
            }

            return null;
          })}

          <PopoverDropdownItem
            className={'border-t border-gray-100 dark:border-black-400'}
            onClick={() => setIsOrganizationModalOpen(true)}
          >
            <PopoverDropdownItem.Label>
              <span
                data-cy={'create-organization-button'}
                className={'flex flex-row items-center space-x-2 ellipsify'}
              >
                <PlusIcon className={'h-4 font-bold'} />

                <span>
                  <Trans
                    i18nKey={'organization:createOrganizationDropdownLabel'}
                  />
                </span>
              </span>
            </PopoverDropdownItem.Label>
          </PopoverDropdownItem>
        </PopoverDropdown>
      </div>

      <CreateOrganizationModal
        setIsOpen={setIsOrganizationModalOpen}
        isOpen={isOrganizationModalOpen}
        onCreate={organizationSelected}
      />
    </>
  );
};

function OrganizationItem({ organization }: { organization: Organization }) {
  const { logoURL, name } = organization;
  const imageSize = 22;

  return (
    <span
      data-cy={'organization-selector-item'}
      className={`flex min-w-[6rem] max-w-[12rem] items-center space-x-2`}
    >
      <If condition={logoURL}>
        <span className={'flex flex-1 items-center'}>
          <Image
            width={imageSize}
            height={imageSize}
            alt={`${name} Logo`}
            className={'object-contain'}
            src={logoURL as string}
          />
        </span>
      </If>

      <span className={'w-auto text-left font-semibold ellipsify'}>{name}</span>
    </span>
  );
}

function saveOrganizationIdInCookie(organizationId: string) {
  const cookieName = `organizationId`;
  const path = '/';

  setCookie(undefined, cookieName, organizationId, { path });
}

export default OrganizationsSelector;
