import organizationPageObject from '../../support/organization.po';

describe(`Create Organization`, () => {
  const organizationName = `New Organization`;

  before(() => {
    cy.signIn(`/dashboard`);
  });

  describe(`Given the user updates the organization name and logo`, () => {
    before(() => {
      organizationPageObject.$currentOrganization().click();
      organizationPageObject.$createOrganizationButton().click();

      organizationPageObject
        .$createOrganizationNameInput()
        .type(organizationName);

      organizationPageObject.$confirmCreateOrganizationButton().click();
    });

    it('the current selected organization will be the one created', () => {
      organizationPageObject
        .$currentOrganization()
        .should('contain', organizationName);
    });
  });
});
