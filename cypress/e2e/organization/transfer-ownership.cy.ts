import organizationPo from '../../support/organization.po';
import authPo from '../../support/auth.po';
import organizationPageObject from '../../support/organization.po';

describe(`Transfer Ownership`, () => {
  const targetMemberEmail = `test-transfer-ownership@makerkit.dev`;
  const currentMemberEmail = authPo.getDefaultUserEmail();

  function signIn() {
    cy.signIn(`/settings/organization/members`);
  }

  function transferOwnership(email: string) {
    organizationPo.transferOwnership(email);
    organizationPo.$getConfirmTransferOwnershipButton().click();
  }

  before(() => {
    organizationPageObject.useDefaultOrganization();
    signIn();
  });

  describe(`When the owner transfers ownership`, () => {
    before(() => {
      transferOwnership(targetMemberEmail);
    });

    it('should mark the new owner as "Owner"', () => {
      cy.wait(1000);

      organizationPo.$getMemberByEmail(targetMemberEmail).within(() => {
        organizationPo.$getRoleBadge().should(`contain`, `Owner`);
      });
    });

    it('should mark the current user as "Admin"', () => {
      organizationPo.$getMemberByEmail(`You`).within(() => {
        organizationPo.$getRoleBadge().should(`contain`, `Admin`);
      });
    });

    it('should disallow actions on the new owner', () => {
      organizationPo.$getMemberByEmail(targetMemberEmail).within(() => {
        organizationPo.$getMemberActionsDropdown().should('be.disabled');
      });
    });
  });
});
