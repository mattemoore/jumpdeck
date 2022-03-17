import organizationPageObject from '../../support/organization.po';
import { MembershipRole } from '~/lib/organizations/types/membership-role';

describe(`Update User Role`, () => {
  const email = `test-role-update@makerkit.dev`;

  before(() => {
    cy.signIn(`/settings/organization/members`);
    organizationPageObject.switchToOrganization('Test');
  });

  describe(`Given the current user updates a member's role`, () => {
    before(() => {
      organizationPageObject.updateMemberRole(email, MembershipRole.Admin);
    });

    describe('When the request is successful', () => {
      it('the UI will be updated accordingly', () => {
        organizationPageObject.$getMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should(`contain`, `Admin`);
        });
      });
    });

    describe('When the role is the same as the current one', () => {
      it('the UI will display an error', () => {
        organizationPageObject.updateMemberRole(email, MembershipRole.Admin);

        cy.get(`.chooseDifferentRoleError`).should('be.visible');
        cy.cyGet(`close-modal-button`).click();
      });
    });
  });

  describe(`Given the current user reverts the previous member's role`, () => {
    describe('When the request is successful', () => {
      it('the UI will be updated accordingly', () => {
        organizationPageObject.updateMemberRole(email, MembershipRole.Member);

        organizationPageObject.$getMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should(`contain`, `Member`);
        });
      });
    });
  });
});
