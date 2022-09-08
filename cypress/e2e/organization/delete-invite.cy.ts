import organizationPageObject from '../../support/organization.po';

describe(`Delete Invite`, () => {
  // this invite has been pre-populated with the following email
  const invitedMemberEmail = `invite-delete@makerkit.dev`;

  before(() => {
    organizationPageObject.useDefaultOrganization();
    cy.signIn(`/settings/organization/members`);
  });

  describe(`When the invite is deleted`, () => {
    before(() => {
      organizationPageObject
        .$getInvitedMemberByEmail(invitedMemberEmail)
        .within(() => {
          organizationPageObject.$getDeleteInviteButton().should('be.visible');

          organizationPageObject
            .$getDeleteInviteButton()
            .click({ force: true });
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
