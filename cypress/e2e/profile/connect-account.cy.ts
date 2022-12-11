import { EmailAuthProvider } from 'firebase/auth';
import authPo from '../../support/auth.po';
import profilePo from '../../support/profile.po';

describe(`Connect Accounts`, () => {
  const existingEmailAddress = `multi-account-email@makerkit.dev`;
  const password = authPo.getDefaultUserPassword();

  beforeEach(() => {
    cy.signIn(`/settings/profile/authentication`, {
      email: existingEmailAddress,
      password,
    });
  });

  describe(`when unlinking an email/password account`, () => {
    it('should remove it from the connected accounts', () => {
      profilePo.$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID).click();
      profilePo.$confirmUnlinkButton().click();

      profilePo
        .$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID)
        .should('not.exist');
    });
  });

  describe(`when linking an email/password account`, () => {
    it('should add it from the connected accounts', () => {
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
