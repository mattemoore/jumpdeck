import { FirestoreOrganizationMembership } from './organization-membership';
import { OrganizationSubscription } from './organization-subscription';

type UserId = string;

interface BaseOrganization {
  name: string;
  timezone?: string;
  logoURL?: string | null;
  subscription?: OrganizationSubscription;
  customerId?: string;
}

export interface Organization extends BaseOrganization {
  members: Record<UserId, FirestoreOrganizationMembership>;
}
