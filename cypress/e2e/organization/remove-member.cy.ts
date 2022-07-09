import organizationPageObject from '../../support/organization.po';

describe(`Remove Member`, () => {
  const email = `test-remove@makerkit.dev`;

  before(() => {
    cy.signIn(`/settings/organization/members`);
  });

  describe(`Given the current user updates a member's role`, () => {
    before(() => {
      organizationPageObject.switchToOrganization('Test');
      organizationPageObject.removeMember(email);
    });

    it('the UI will be updated', () => {
      organizationPageObject.$getMemberByEmail(email).should('not.exist');
    });
  });
});
