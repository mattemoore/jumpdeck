import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';
import { OrganizationPlanStatus } from '~/lib/organizations/types/organization-subscription';

/**
 * @name useIsSubscriptionActive
 * @description Returns whether the organization is on any paid
 * subscription, regardless of plan.
 */
function useIsSubscriptionActive() {
  const organization = useCurrentOrganization();

  return organization?.subscription?.status === OrganizationPlanStatus.Paid;
}

export default useIsSubscriptionActive;
