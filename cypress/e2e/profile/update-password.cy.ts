import profilePo from '../../support/profile.po';
import configuration from '~/configuration';
import authPo from '../../support/auth.po';

describe(`Update Password`, () => {
  const existingEmailAddress = `new-password@makerkit.dev`;
  const currentPassword = authPo.getDefaultUserPassword();
  const newPassword = `newpassword`;

  before(() => {
    cy.signIn(`/settings/profile/password`, {
      email: existingEmailAddress,
      password: currentPassword,
    });
  });

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
    before(() => {
      fillForm({
        currentPassword,
        newPassword,
        repeatPassword: 'anotherpassword',
      });
    });

    it('should display an error on the repeat password input', () => {
      cy.cyGet('repeat-password-error')
        .should(
          `contain.text`,
          `Passwords do not match. Make sure you're using the correct password`
        );
    });
  });

  describe(`When the password is the same as the current password`, () => {
    before(() => {
      fillForm({
        currentPassword,
        newPassword: currentPassword,
        repeatPassword: currentPassword,
      });
    });

    it('should display an error on the new password input', () => {
      cy.cyGet('new-password-error')
        .should(`contain.text`, `Your password has not changed`);
    });
  });

  describe(`When the user enters the wrong password`, () => {
    before(() => {
      fillForm({
        currentPassword: 'wrongpassword',
        newPassword: newPassword,
        repeatPassword: newPassword,
      });
    });

    it('should display an alert', () => {
      profilePo.$getUpdatePasswordErrorAlert().should(`be.visible`);
    });
  });

  describe(`When updating the password and the passwords do match`, () => {
    before(() => {
      fillForm({
        currentPassword,
        newPassword: newPassword,
        repeatPassword: newPassword,
      });
    });

    it('should remove the error alert and successfully execute the operation', () => {
      profilePo.$getUpdatePasswordErrorAlert().should('not.exist');
    });

    it('should reset the form values', () => {
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
