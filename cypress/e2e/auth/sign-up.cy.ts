import auth from '../../support/auth.po';
import configuration from '~/configuration';

const randomNumber = () => Math.round(Math.random() * 100);

describe(`Sign Up`, () => {
  // randomize email to avoid using duplicate emails
  const email = `test+${randomNumber()}@makerkit.dev`;
  const password = `makerkitpwd`;

  beforeEach(() => {
    cy.visit(`/auth/sign-up`);
  });

  describe(`given the user signs up with email/password`, () => {
    describe(`when the request is successful`, () => {
      it('should redirect users to the onboarding', () => {
        auth.$getEmailInput().type(email);
        auth.$getPasswordInput().type(password);
        auth.$getSubmitButton().click();

        cy.url().should('contain', configuration.paths.onboarding);
      });
    });

    describe(`when the request is unsuccessful because the user already signed up`, () => {
      it('should display an error message', () => {
        auth.$getEmailInput().type(email);
        auth.$getPasswordInput().type(password);
        auth.$getSubmitButton().click();

        auth.$getErrorMessage().should('exist');
      });
    });
  });
});
