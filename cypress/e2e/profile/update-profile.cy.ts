import profilePo from '../../support/profile.po';

describe(`Update Profile`, () => {
  describe(`When updating the user Display name`, () => {
    const newDisplayName = `Makerkit Guy`;

    it('should store the new display name', () => {
      cy.signIn(`/settings/profile`);

      profilePo.$getDisplayNameInput().type(newDisplayName);
      profilePo.$getUpdateProfileForm().submit();

      cy.wait(250);
      cy.reload();

      profilePo
        .$getDisplayNameInput()
        .then(($el) => $el.val())
        .should('equal', newDisplayName);
    });
  });
});
