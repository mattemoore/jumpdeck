import organizationPageObject from '../../support/organization.po';
import { MembershipRole } from '~/lib/organizations/types/membership-role';

describe(`Create Invite`, () => {
  const email = `invited-member@makerkit.dev`;

  before(() => {
    organizationPageObject.useDefaultOrganization();
    cy.signIn(`/settings/organization/members/invite`);
  });

  describe(`Given a user invites a new member`, () => {
    describe(`When entering current user's email address`, () => {
      before(() => {
        const emailAddress = `test@makerkit.dev`;
        organizationPageObject.$getInvitationEmailInput().type(emailAddress);
        organizationPageObject.$getInviteMembersForm().submit();
      });

      it('should disallow the form submission', () => {
        const validity = false;
        getInviteMembersFormValidity().should('equal', validity);
      });
    });

    describe(`When entering the same email address multiple times`, () => {
      before(() => {
        const emailAddress = `dupe@makerkit.dev`;

        // here we add the same email into multiple rows
        organizationPageObject
          .$getInvitationEmailInput()
          .clear()
          .type(emailAddress);

        organizationPageObject.$getAppendNewInviteButton().click();
        organizationPageObject.$getInvitationEmailInput(1).type(emailAddress);
        organizationPageObject.$getInviteMembersForm().submit();
      });

      it('should disallow the form submission', () => {
        const validity = false;
        getInviteMembersFormValidity().should('equal', validity);
      });
    });

    describe(`When the user is invited successfully`, () => {
      before(() => {
        cy.reload();
        organizationPageObject.inviteMember(email, MembershipRole.Member);
      });

      it('should be added to the list', () => {
        organizationPageObject.$getInvitedMemberByEmail(email).should('exist');
      });
    });

    describe(`When the same user is invited again`, () => {
      it('should update the existing invite', () => {
        organizationPageObject.navigateToInviteForm();
        organizationPageObject.inviteMember(email, MembershipRole.Admin);

        organizationPageObject.$getInvitedMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should('have.text', `Admin`);
        });
      });
    });
  });
});

function getInviteMembersFormValidity() {
  return organizationPageObject.$getInviteMembersForm().then(($form) => {
    const form = $form.get()[0] as HTMLFormElement;

    return form.checkValidity();
  });
}
