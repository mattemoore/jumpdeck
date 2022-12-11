import authPo from '../../support/auth.po';
import configuration from '~/configuration';
import organizationPageObject from '../../support/organization.po';

describe(`Accept Invite - Existing User`, () => {
  const existingUserEmail = `test2@makerkit.dev`;
  const existingUserInviteCode = 'pUhu9GACbZg1Cwj3muYw';

  describe(`when the user accepts the invite`, () => {
    before(() => {
      const password = authPo.getDefaultUserPassword();
      const invitePath = `/auth/invite/${existingUserInviteCode}`;

      cy.signIn(invitePath, {
        email: existingUserEmail,
        password,
      });
    });

    it('should be redirected to the dashboard', () => {
      authPo.$getAcceptInviteSubmitButton().click();

      cy.url().should('contain', configuration.paths.appHome);
    });
  });

  describe(`when the user visits the members page`, () => {
    before(() => {
      organizationPageObject.useDefaultOrganization();
      cy.signIn(`/settings/organization/members`);
    });

    it(
      'should remove the new member from the invited list and list the new' +
        ' one',
      () => {
        organizationPageObject
          .$getInvitedMemberByEmail(existingUserEmail)
          .should('not.exist');

        organizationPageObject
          .$getMemberByEmail(existingUserEmail)
          .should('exist');
      }
    );
  });
});
