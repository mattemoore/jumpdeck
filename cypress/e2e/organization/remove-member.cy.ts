import organizationPageObject from '../../support/organization.po';

describe(`Remove Member`, () => {
  const targetEmail = `test-remove@makerkit.dev`;

  describe(`Given the current user removes a member from the organization`, () => {
    it('the member should disappear from the list', () => {
      cy.signIn(`/settings/organization/members`);

      organizationPageObject.removeMember(targetEmail);
      organizationPageObject.$getMemberByEmail(targetEmail).should('not.exist');
    });
  });
});
