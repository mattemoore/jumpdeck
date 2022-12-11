import profilePo from '../../support/profile.po';
import configuration from '~/configuration';
import authPo from '../../support/auth.po';

describe(`Update Email`, () => {
  const existingEmailAddress = `test-email@makerkit.dev`;
  const password = authPo.getDefaultUserPassword();
  const newEmailAddress = `new-email@makerkit.dev`;

  function signIn() {
    cy.signIn(`/settings/profile/email`, {
      email: existingEmailAddress,
      password,
    });
  }

  describe(`When updating the user Email with the existing email address`, () => {
    it('should display an alert', () => {
      signIn();

      profilePo.$getNewEmailInput().type(existingEmailAddress);
      profilePo.$getRepeatEmailInput().type(existingEmailAddress);
      profilePo.$getUpdateEmailPasswordInput().type('anypass');

      profilePo.$getUpdateEmailForm().submit();
      profilePo.$getUpdateEmailErrorAlert().should('be.visible');
    });
  });

  describe(`When updating the user Email and the emails do not match`, () => {
    it('should display an alert', () => {
      signIn();

      profilePo.$getNewEmailInput().clear().type(newEmailAddress);
      profilePo.$getRepeatEmailInput().clear().type(newEmailAddress);
      profilePo.$getUpdateEmailPasswordInput().clear().type(`wrong password`);

      profilePo.$getUpdateEmailForm().submit();
      profilePo.$getUpdateEmailErrorAlert().should('be.visible');
    });
  });

  describe(`When updating the user Email and the emails do match`, () => {
    it('should remove the error alert', () => {
      signIn();

      profilePo.$getNewEmailInput().clear().type(newEmailAddress);
      profilePo.$getRepeatEmailInput().clear().type(newEmailAddress);
      profilePo.$getUpdateEmailPasswordInput().clear().type(password);
      profilePo.$getUpdateEmailForm().submit();

      profilePo.$getUpdateEmailErrorAlert().should('not.exist');
      profilePo.$getNewEmailInput().invoke('val').should('be.empty');
      profilePo.$getRepeatEmailInput().invoke('val').should('be.empty');
      profilePo.$getUpdateEmailPasswordInput().invoke('val').should('be.empty');
    });
  });

  describe('When logging in with the new email', () => {
    it('should work', () => {
      cy.signIn(configuration.paths.appHome, {
        email: newEmailAddress,
        password,
      });

      cy.url().should('contain', configuration.paths.appHome);
    });
  });
});
