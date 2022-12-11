import organizationPageObject from '../../support/organization.po';

describe(`Update Organization`, () => {
  const organizationName = `Organization Name`;

  describe(`Given the user updates the organization name and logo`, () => {
    it('the UI will be updated', () => {
      cy.signIn(`/settings/organization`);

      organizationPageObject.$getOrganizationNameInput().type(organizationName);
      organizationPageObject.$getUpdateOrganizationSubmitButton().click();

      organizationPageObject
        .$currentOrganization()
        .should('contain', organizationName);
    });
  });
});
