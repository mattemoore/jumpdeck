import type { MembershipRole } from './membership-role';
import type { UserData } from '~/core/session/types/user-data';

interface Reference {
  readonly id: string;
}

interface BaseOrganizationMembership {
  role: MembershipRole;
}

export interface OrganizationMembership extends BaseOrganizationMembership {
  user: UserData;
}

export interface FirestoreOrganizationMembership<
  UserReference extends Reference = Reference
> extends BaseOrganizationMembership {
  user: UserReference;
}
