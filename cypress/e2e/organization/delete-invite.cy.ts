import organizationPageObject from '../../support/organization.po';

describe(`Delete Invite`, () => {
  // this invite has been pre-populated with the following email
  const invitedMemberEmail = `invite-delete@makerkit.dev`;

  before(() => {
    cy.signIn(`/settings/organization/members`);
    organizationPageObject.switchToOrganization('Test');
  });

  describe(`When the invite is deleted`, () => {
    before(() => {
      organizationPageObject
        .$getInvitedMemberByEmail(invitedMemberEmail)
        .within(() => {
          organizationPageObject.$getDeleteInviteButton().click();
        });

      organizationPageObject.$getConfirmDeleteInviteButton().click();
    });

    it('should be removed from the list', () => {
      organizationPageObject
        .$getInvitedMemberByEmail(invitedMemberEmail)
        .should('not.exist');
    });
  });
});