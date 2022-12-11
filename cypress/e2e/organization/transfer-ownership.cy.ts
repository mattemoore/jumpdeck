import organizationPo from '../../support/organization.po';

describe(`Transfer Ownership`, () => {
  const targetMemberEmail = `test-transfer-ownership@makerkit.dev`;

  function signIn() {
    cy.signIn(`/settings/organization/members`);
  }

  function transferOwnership(email: string) {
    organizationPo.transferOwnership(email);
    organizationPo.$getConfirmTransferOwnershipButton().click();
  }

  beforeEach(() => {
    signIn();
  });

  describe(`When the owner transfers ownership`, () => {
    it('should mark the new owner as "Owner"', () => {
      transferOwnership(targetMemberEmail);

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
