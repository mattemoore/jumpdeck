import authPo from '../../support/auth.po';
import configuration from '~/configuration';
import organizationPageObject from '../../support/organization.po';

describe(`Accept Invite - Existing User`, () => {
  const existingUserEmail = `test2@makerkit.dev`;
  const existingUserInviteCode = 'pUhu9GACbZg1Cwj3muYw';

  before(() => {
    const password = Cypress.env('PASSWORD') as string;
    const invitePath = `/auth/invite/${existingUserInviteCode}`;

    cy.signIn(invitePath, {
      email: existingUserEmail,
      password,
    });
  });

  it('should be redirected to the dashboard', () => {
    authPo.$getAcceptInviteSubmitButton().click();

    cy.url().should('contain', configuration.paths.appHome);

    organizationPageObject.switchToOrganization('Test');

    // we visit
    cy.visit(`/settings/organization/members`);
  });

  it('should remove the new member from the invited list', () => {
    organizationPageObject
      .$getInvitedMemberByEmail(existingUserEmail)
      .should('not.exist');
  });

  it('should list the new member', () => {
    organizationPageObject.$getMemberByEmail(existingUserEmail).should('exist');
  });
});