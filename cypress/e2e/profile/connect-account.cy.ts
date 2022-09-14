import { EmailAuthProvider } from 'firebase/auth';
import authPo from '../../support/auth.po';
import profilePo from '../../support/profile.po';

describe(`Connect Accounts`, () => {
  const existingEmailAddress = `multi-account-email@makerkit.dev`;
  const password = authPo.getDefaultUserPassword();

  before(() => {
    cy.signIn(`/settings/profile/authentication`, {
      email: existingEmailAddress,
      password,
    });
  });

  describe(`when unlinking an email/password account`, () => {
    before(() => {
      profilePo.$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID).click();
      profilePo.$confirmUnlinkButton().click();
    });

    it('should remove it from the connected accounts', () => {
      profilePo
        .$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID)
        .should('not.exist');
    });
  });

  describe(`when linking an email/password account`, () => {
    it('should add it from the connected accounts', () => {
      profilePo.$getLinkProviderButton(EmailAuthProvider.PROVIDER_ID).click();

      // reuse signUpWithEmailAndPassword function here
      authPo.signUpWithEmailAndPassword(existingEmailAddress, password);

      profilePo
        .$getUnlinkProviderButton(EmailAuthProvider.PROVIDER_ID)
        .should('exist');
    });
  });
});
