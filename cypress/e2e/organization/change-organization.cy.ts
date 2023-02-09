import organizationPageObject from '../../support/organization.po';
import configuration from '~/configuration';

describe(`Change Organization`, () => {
  const organizationName = `New Organization ${Math.random() * 100}`;
  const originalOrganizationName = `Test`;

  const originalOrganizationId =
    organizationPageObject.getDefaultOrganizationId();

  describe(`Given the user changes organization using the organizations selector`, () => {
    it('the UI should reflect the change', () => {
      cy.signIn(configuration.paths.appHome);

      organizationPageObject.createOrganization(organizationName);
      organizationPageObject.switchToOrganization(originalOrganizationName);
    });
  });

  describe(`Given the user changes organization using the URL`, () => {
    it('the UI should reflect the change', () => {
      cy.signIn(configuration.paths.appHome);

      organizationPageObject.switchToOrganization(organizationName);

      cy.visit(`/${originalOrganizationId}/dashboard`);

      organizationPageObject.assertCurrentOrganization(
        originalOrganizationName
      );
    });
  });

  describe(`Given the user changes organization they do not belong to`, () => {
    it('they should be redirected to a 404', () => {
      cy.signIn(configuration.paths.appHome);

      cy.visit(`/6/dashboard`, { failOnStatusCode: false });
      cy.cyGet('catch-route-status-code').should('contain', '404');
    });
  });

  describe(`Given the user navigates to a non-existent URL`, () => {
    it('they should be redirected to a 404', () => {
      cy.signIn(configuration.paths.appHome);

      cy.visit(`/1234`, { failOnStatusCode: false });
      cy.cyGet('catch-route-status-code').should('contain', '404');
    });
  });
});
