import profilePo from '../../support/profile.po';

describe(`Update Profile`, () => {
  before(() => {
    cy.signIn(`/settings/profile`);
  });

  describe(`When updating the user Display name`, () => {
    const newDisplayName = `Makerkit Guy`;

    before(() => {
      profilePo.$getDisplayNameInput().type(newDisplayName);
      profilePo.$getUpdateProfileForm().submit();

      cy.wait(500);
      cy.reload();
    });

    it('should store the new display name', () => {
      profilePo
        .$getDisplayNameInput()
        .then(($el) => $el.val())
        .should('equal', newDisplayName);
    });
  });
});
