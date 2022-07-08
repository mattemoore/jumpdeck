import organizationPageObject from '../../support/organization.po';

describe(`Update Organization`, () => {
  const organizationName = `Test Org`;

  before(() => {
    cy.signIn(`/settings/organization`);
  });

  describe(`Given the user updates the organization name and logo`, () => {
    before(() => {
      organizationPageObject.$getOrganizationNameInput().type(organizationName);
      organizationPageObject.$getUpdateOrganizationSubmitButton().click();
    });

    it('the UI will be updated', () => {
      organizationPageObject
        .$currentOrganization()
        .should('contain', organizationName);
    });
  });
});
