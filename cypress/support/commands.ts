// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import authPo from './auth.po';

Cypress.Commands.add('cyGet', (name: string) => {
  return cy.get(createCySelector(name));
});

Cypress.Commands.add(
  'signIn',
  (redirectPath = '/', credentials = authPo.getDefaultUserCredentials()) => {
    preserveCookies();

    cy.log(
      `Signing in programmatically and redirecting to ${redirectPath} ...`
    );

    authPo.signInProgrammatically(credentials);

    cy.log(`Successfully signed in`);

    cy.visit(redirectPath);
  }
);

Cypress.Commands.add(`clearStorage`, () => {
  cy.clearCookies();
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
  localStorage.clear();
  sessionStorage.clear();
});

Cypress.Commands.add(`signOutSession`, () => {
  cy.request(`POST`, `/api/session/sign-out`);
});

export function createCySelector(name: string) {
  return `[data-cy="${name}"]`;
}

function preserveCookies() {
  // preserve the session cookie between tests
  // otherwise the user will get logged out
  Cypress.Cookies.defaults({
    preserve: [
      'session',
      'sessionExpiresAt',
      'organizationId',
      'csrfToken',
      'csrfSecret',
    ],
  });
}
