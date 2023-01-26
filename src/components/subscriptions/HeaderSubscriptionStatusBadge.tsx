import Link from 'next/link';
import SubscriptionStatusBadge from '~/components/subscriptions/SubscriptionStatusBadge';
import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';

function HeaderSubscriptionStatusBadge() {
  const organization = useCurrentOrganization();
  const subscription = organization?.subscription;

  // if the organization has an active subscription
  // we do not show the subscription status badge
  if (subscription?.status === 'active') {
    return null;
  }

  // in all other cases we show the subscription status badge
  // which will show the subscription status and a link to the subscription page
  return (
    <Link href={'/settings/subscription'}>
      <SubscriptionStatusBadge subscription={subscription} />
    </Link>
  );
}

export default HeaderSubscriptionStatusBadge;
