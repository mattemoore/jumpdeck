import organizationPageObject from '../../support/organization.po';

describe(`Remove Member`, () => {
  const targetEmail = `test-remove@makerkit.dev`;

  before(() => {
    organizationPageObject.useDefaultOrganization();
    cy.signIn(`/settings/organization/members`);
  });

  describe(`Given the current user removes a member from the organization`, () => {
    before(() => {
      organizationPageObject.removeMember(targetEmail);
    });

    it('the member should disappear from the list', () => {
      organizationPageObject.$getMemberByEmail(targetEmail).should('not.exist');
    });
  });
});
