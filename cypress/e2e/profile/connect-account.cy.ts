import { EmailAuthProvider } from 'firebase/auth';
import authPo from '../../support/auth.po';
import profilePo from '../../support/profile.po';

describe(`Connect Accounts`, () => {
  const existingEmailAddress = `multi-account-email@makerkit.dev`;
  const password = authPo.getDefaultUserPassword();

  function signIn() {
    cy.signIn(`/settings/profile/authentication`, {
      email: existingEmailAddress,
      password,
    });
  }

  describe(`email/password`, () => {
    it('should be able to unlink/relink its account', () => {
      signIn();

      profilePo.$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID).click();
      profilePo.$confirmUnlinkButton().click();

      profilePo
        .$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID)
        .should('not.exist');

      profilePo
        .$getLinkProviderButton(EmailAuthProvider.PROVIDER_ID)
        .should('be.visible')
        .click({ force: true });

      // reuse signUpWithEmailAndPassword function here
      authPo.signUpWithEmailAndPassword(existingEmailAddress, password);

      profilePo
        .$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID)
        .should('exist');
    });
  });
});
