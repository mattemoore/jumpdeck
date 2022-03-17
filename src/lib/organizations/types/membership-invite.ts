import { MembershipRole } from './membership-role';

export interface MembershipInvite {
  email: string;
  role: MembershipRole;
  code: string;
  expiresAt: number;

  organization: {
    id: string;
    name: string;
  };
}
