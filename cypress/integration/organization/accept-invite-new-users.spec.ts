import organizationPageObject from '../../support/organization.po';
import authPo from '../../support/auth.po';
import configuration from '~/configuration';

describe(`Accept Invite - New User`, () => {
  const nonExistingUserEmail = `user-invite-email-pwd@makerkit.dev`;
  const nonExistingUserInviteCode = 'v1DwLrD9n5X4Uakgymi3';

  before(() => {
    Cypress.Cookies.defaults({
      preserve: ['session'],
    });

    visitInvitePage(nonExistingUserInviteCode);

    // and then, sign user up
    authPo.signInWithEmailAndPassword(nonExistingUserEmail, 'anypass');
  });

  it('should be redirected to the dashboard', () => {
    cy.url().should('contain', configuration.paths.appHome);

    // go back to members page
    cy.visit('/settings/organization/members');
  });

  it('should remove the new member from the invited list', () => {
    organizationPageObject
      .$getInvitedMemberByEmail(nonExistingUserEmail)
      .should('not.exist');
  });

  it('should list the new member', () => {
    organizationPageObject
      .$getMemberByEmail(nonExistingUserEmail)
      .should('exist');
  });
});

function visitInvitePage(code: string) {
  const url = `/auth/invite/${code}`;

  cy.visit(url);
}
