import organizationPageObject from '../../support/organization.po';
import { MembershipRole } from '~/lib/organizations/types/membership-role';

describe(`Update User Role`, () => {
  const email = `test-role-update@makerkit.dev`;

  beforeEach(() => {
    cy.signIn(`/settings/organization/members`);
  });

  describe(`Given the current user updates a member's role`, () => {
    describe('When the request is successful', () => {
      it('the UI will be updated accordingly', () => {
        organizationPageObject.updateMemberRole(email, MembershipRole.Admin);

        organizationPageObject.$getMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should(`contain`, `Admin`);
        });
      });
    });
  });
});
