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
    describe(`when the passwords mismatch`, () => {
      it('should return an error', () => {
        auth.signUpWithEmailAndPassword(email, password, 'anotherpassword');

        cy.url().should('contain', configuration.paths.signUp);
      });
    });

    describe(`when the request is successful`, () => {
      it('should redirect users to the onboarding', () => {
        auth.signUpWithEmailAndPassword(email, password);

        cy.url().should('contain', configuration.paths.onboarding);
      });
    });

    describe(`when the request is unsuccessful because the user already signed up`, () => {
      it('should display an error message', () => {
        auth.signUpWithEmailAndPassword(email, password);
        auth.$getErrorMessage().should('exist');
      });
    });
  });
});
