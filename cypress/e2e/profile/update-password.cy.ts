import profilePo from '../../support/profile.po';
import configuration from '~/configuration';
import authPo from '../../support/auth.po';

describe(`Update Password`, () => {
  const existingEmailAddress = `new-password@makerkit.dev`;
  const currentPassword = authPo.getDefaultUserPassword();
  const newPassword = `newpassword`;

  function fillForm(params: {
    currentPassword: string;
    newPassword: string;
    repeatPassword: string;
  }) {
    profilePo.$getCurrentPasswordInput().clear().type(params.currentPassword);
    profilePo.$getNewPasswordInput().clear().type(params.newPassword);
    profilePo.$getRepeatNewPasswordInput().clear().type(params.repeatPassword);

    profilePo.$getUpdatePasswordForm().submit();
  }

  describe(`When the passwords do not match`, () => {
    beforeEach(() => {
      cy.signIn(`/settings/profile/password`, {
        email: existingEmailAddress,
        password: currentPassword,
      });
    });

    it('should display an error on the repeat password input', () => {
      fillForm({
        currentPassword,
        newPassword,
        repeatPassword: 'anotherpassword',
      });

      cy.cyGet('repeat-password-error').should(
        `contain.text`,
        `Passwords do not match. Make sure you're using the correct password`
      );
    });
  });

  describe(`When the password is the same as the current password`, () => {
    before(() => {
      cy.signIn(`/settings/profile/password`, {
        email: existingEmailAddress,
        password: currentPassword,
      });
    });

    it('should display an error on the new password input', () => {
      fillForm({
        currentPassword,
        newPassword: currentPassword,
        repeatPassword: currentPassword,
      });

      cy.cyGet('new-password-error').should(
        `contain.text`,
        `Your password has not changed`
      );
    });
  });

  describe(`When the user enters the wrong password`, () => {
    before(() => {
      cy.signIn(`/settings/profile/password`, {
        email: existingEmailAddress,
        password: currentPassword,
      });
    });

    it('should display an alert', () => {
      fillForm({
        currentPassword: 'wrongpassword',
        newPassword: newPassword,
        repeatPassword: newPassword,
      });

      profilePo.$getUpdatePasswordErrorAlert().should(`be.visible`);
    });
  });

  describe(`When updating the password and the passwords do match`, () => {
    before(() => {
      cy.signIn(`/settings/profile/password`, {
        email: existingEmailAddress,
        password: currentPassword,
      });
    });

    it('should remove the error alert and successfully execute the operation', () => {
      fillForm({
        currentPassword,
        newPassword: newPassword,
        repeatPassword: newPassword,
      });

      profilePo.$getUpdatePasswordErrorAlert().should('not.exist');

      profilePo.$getCurrentPasswordInput().invoke('val').should('be.empty');
      profilePo.$getNewPasswordInput().invoke('val').should('be.empty');
      profilePo.$getRepeatNewPasswordInput().invoke('val').should('be.empty');
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
