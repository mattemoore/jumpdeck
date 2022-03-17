import { createContext } from 'react';
import { Organization } from '~/lib/organizations/types/organization';

export const OrganizationContext = createContext<{
  organization: Maybe<WithId<Organization>>;
  setOrganization: (user: WithId<Organization>) => void;
}>({
  organization: undefined,
  setOrganization: (_) => _,
});
