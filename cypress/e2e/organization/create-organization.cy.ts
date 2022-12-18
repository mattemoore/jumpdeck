import organizationPageObject from '../../support/organization.po';

describe(`Create Organization`, () => {
  const organizationName = `New Organization`;

  const defaultOrganizationId =
    organizationPageObject.getDefaultOrganizationId();

  it('should be able to create a new organization', () => {
    cy.signIn(`/dashboard`);

    organizationPageObject.$currentOrganization().click();
    organizationPageObject.$createOrganizationButton().click();

    organizationPageObject
      .$createOrganizationNameInput()
      .type(organizationName);

    organizationPageObject.$confirmCreateOrganizationButton().click();

    organizationPageObject
      .$currentOrganization()
      .should('contain', organizationName);

    cy.getCookie('organizationId').should(
      'not.have.property',
      'value',
      defaultOrganizationId
    );
  });
});
