import organizationPageObject from '../../support/organization.po';

describe(`Create Organization`, () => {
  const organizationName = `New Organization`;
  const defaultOrganizationId =
    organizationPageObject.getDefaultOrganizationId();

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

      cy.getCookie('organizationId').should(
        'not.have.property',
        'value',
        defaultOrganizationId
      );
    });

    it('should go back to the previous organization', () => {
      organizationPageObject.switchToOrganization('Test');

      cy.getCookie('organizationId').should(
        'have.property',
        'value',
        defaultOrganizationId
      );
    });
  });
});
