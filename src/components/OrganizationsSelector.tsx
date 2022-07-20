import { useCallback, useContext, useState } from 'react';
import Image from 'next/image';

import PlusSmIcon from '@heroicons/react/outline/PlusSmIcon';

import { setCookie } from 'nookies';
import { Trans } from 'next-i18next';

import { Organization } from '~/lib/organizations/types/organization';
import { useFetchUserOrganizations } from '~/lib/organizations/hooks/use-fetch-user-organizations';
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
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const { organization, setOrganization } = useContext(OrganizationContext);
  const { data: organizations } = useFetchUserOrganizations(userId);

  const organizationSelected = useCallback(
    (item: WithId<Organization>) => {
      // update the global Organization context
      // with the selected organization
      setOrganization(item);

      // we save the selected organization in
      // a cookie so that we can return to it when
      // the user refreshes or navigates elsewhere
      saveOrganizationIdInCookie(item.id);
    },
    [setOrganization]
  );

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
                <PlusSmIcon className={'h-4 font-bold'} />

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
  const maxLabelWidth = `12rem`;
  const minLabelWidth = `6.5rem`;

  return (
    <span
      data-cy={'organization-selector-item'}
      className={`flex items-center space-x-3 ellipsify`}
    >
      <If condition={logoURL}>
        <Image
          layout={'fixed'}
          width={'20px'}
          height={'20px'}
          alt={`${name} Logo`}
          className={'object-contain'}
          src={logoURL as string}
        />
      </If>

      <span
        className={'text-left font-semibold ellipsify'}
        style={{ maxWidth: maxLabelWidth, minWidth: minLabelWidth }}
      >
        {name}
      </span>
    </span>
  );
}

function saveOrganizationIdInCookie(organizationId: string) {
  const cookieName = `organizationId`;
  const path = '/';

  setCookie(undefined, cookieName, organizationId, { path });
}

export default OrganizationsSelector;
