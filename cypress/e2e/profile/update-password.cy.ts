import profilePo from '../../support/profile.po';
import configuration from '~/configuration';

describe(`Update Password`, () => {
  const existingEmailAddress = `new-email@makerkit.dev`;
  const existingPassword = `testingpassword`;
  const newPassword = `newpassword`;

  before(() => {
    cy.signIn(`/settings/profile/password`, {
      email: existingEmailAddress,
      password: existingPassword,
    });
  });

  describe(`When the passwords do not match`, () => {
    before(() => {
      profilePo.$getCurrentPasswordInput().clear().type(existingPassword);
      profilePo.$getNewPasswordInput().clear().type(newPassword);
      profilePo.$getRepeatNewPasswordInput().clear().type('anotherpassword');

      profilePo.$getUpdatePasswordForm().submit();
    });

    it('should display an alert', () => {
      profilePo.$getUpdatePasswordErrorAlert().should(`be.visible`);
    });
  });

  describe(`When the user enters the wrong password`, () => {
    before(() => {
      profilePo.$getCurrentPasswordInput().clear().type('anotherpassword');
      profilePo.$getNewPasswordInput().clear().type(newPassword);
      profilePo.$getRepeatNewPasswordInput().clear().type(newPassword);

      profilePo.$getUpdatePasswordForm().submit();
    });

    it('should display an alert', () => {
      profilePo.$getUpdatePasswordErrorAlert().should(`be.visible`);
    });
  });

  describe(`When updating the password and the passwords do match`, () => {
    before(() => {
      profilePo.$getCurrentPasswordInput().clear().type(existingPassword);
      profilePo.$getNewPasswordInput().clear().type(newPassword);
      profilePo.$getRepeatNewPasswordInput().clear().type(newPassword);
      profilePo.$getUpdatePasswordForm().submit();
    });

    it('should remove the error alert', () => {
      profilePo.$getUpdatePasswordErrorAlert().should('not.exist');
    });
  });

  describe('When logging in with the new password', () => {
    it('should work', () => {
      cy.signIn(configuration.paths.appHome, {
        email: existingEmailAddress,
        password: newPassword,
      });

      cy.url().should('contain', configuration.paths.appHome);
    });
  });
});
