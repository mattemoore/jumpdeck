import organizationPageObject from '../../support/organization.po';
import { MembershipRole } from '~/lib/organizations/types/membership-role';

describe(`Create Invite`, () => {
  const email = `invited-member@makerkit.dev`;

  before(() => {
    cy.signIn(`/settings/organization/members`);
    organizationPageObject.switchToOrganization('Test');
  });

  describe(`Given a user invites a new member`, () => {
    describe(`When the user is invited`, () => {
      before(() => {
        organizationPageObject.inviteMember(email, MembershipRole.Member);
      });

      it('should be added to the list', () => {
        organizationPageObject.$getInvitedMemberByEmail(email).should('exist');
      });
    });

    describe(`When the same user is invited again`, () => {
      it('should update the existing invite', () => {
        organizationPageObject.inviteMember(email, MembershipRole.Admin);

        organizationPageObject.$getInvitedMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should('have.text', `Admin`);
        });
      });
    });
  });
});
