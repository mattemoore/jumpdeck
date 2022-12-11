import organizationPageObject from '../../support/organization.po';

describe(`Delete Invite`, () => {
  // this invite has been pre-populated with the following email
  const invitedMemberEmail = `invite-delete@makerkit.dev`;

  describe(`When the invite is deleted`, () => {
    it('should be removed from the list', () => {
      cy.signIn(`/settings/organization/members`);

      organizationPageObject
        .$getInvitedMemberByEmail(invitedMemberEmail)
        .within(() => {
          organizationPageObject.$getDeleteInviteButton().should('be.visible');

          organizationPageObject
            .$getDeleteInviteButton()
            .click({ force: true });
        });

      organizationPageObject.$getConfirmDeleteInviteButton().click();

      organizationPageObject
        .$getInvitedMemberByEmail(invitedMemberEmail)
        .should('not.exist');
    });
  });
});
