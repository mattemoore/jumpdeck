import { MembershipRole } from '~/lib/organizations/types/membership-role';

const $get = (value: string) => cy.cyGet(value);
const DEFAULT_ORGANIZATION_ID = `jpbCRSjRqW7IddsaKomZ`;

const organizationPageObject = {
  $getOrganizationNameInput: () => $get(`organization-name-input`),
  $getUpdateOrganizationSubmitButton: () =>
    $get(`update-organization-submit-button`),
  $currentOrganization: () => $get(`organization-selector`),
  $createOrganizationButton: () => $get(`create-organization-button`),
  $confirmCreateOrganizationButton: () =>
    $get(`confirm-create-organization-button`),
  $createOrganizationNameInput: () => $get(`create-organization-name-input`),
  $getMemberByEmail(invitedMemberEmail: string) {
    return cy.contains(`[data-cy="organization-member"]`, invitedMemberEmail);
  },
  $getInvitedMembers: () => $get(`invited-member`),
  $getInvitedMemberByEmail(invitedMemberEmail: string) {
    return this.$getInvitedMembers().contains(`[data-cy]`, invitedMemberEmail);
  },
  $getMemberActionsDropdown: () => $get(`member-actions-dropdown`),
  $getInviteMembersForm: () => $get('invite-members-form'),
  $getInvitationEmailInput: (index = 0) => $get(`invite-email-input`).eq(index),
  $getAppendNewInviteButton: () => $get(`append-new-invite-button`),
  $getRemoveInviteButton: () => $get(`remove-invite-button`),
  $getInvitationsSubmitButton: () => $get(`send-invites-button`),
  $getDeleteInviteButton: () => $get(`delete-invite-button`),
  $getConfirmDeleteInviteButton: () => $get(`confirm-delete-invite-button`),
  $getConfirmTransferOwnershipButton: () =>
    $get(`confirm-transfer-ownership-button`),
  $getRoleSelector: (index = 0) =>
    $get(`invite-role-selector-button`).eq(index),
  $getRoleBadge: () => $get(`member-role-badge`),
  $removeMemberActionButton: () => $get(`remove-member-action`),
  $transferOwnershipAction: () => $get('transfer-ownership-action'),
  $updateMemberRoleActionButton: () => $get(`update-member-role-action`),
  navigateToInviteForm: () => $get(`invite-form-link`).click(),
  getDefaultOrganizationId() {
    return DEFAULT_ORGANIZATION_ID;
  },
  useDefaultOrganization: () => {
    cy.setCookie('organizationId', DEFAULT_ORGANIZATION_ID);
  },
  switchToOrganization(name: string) {
    this.$currentOrganization().click();

    cy.contains('[data-cy="organization-selector-item"]', name).click();

    return this;
  },
  openMemberActionsDropdown() {
    this.$getMemberActionsDropdown().click();

    // ugly but needed, elements called right after are detached and Cypress
    // doesn't handle it well
    cy.wait(150);

    return this;
  },
  openRoleSelectorDropdown() {
    this.$getRoleSelector().click();

    return this;
  },
  selectRole(role: MembershipRole) {
    this.openRoleSelectorDropdown();
    cy.cyGet(`listbox-option-${role}`).click();

    return this;
  },
  selectRoleFromRadioGroup(role: MembershipRole) {
    cy.cyGet(`update-role-option-${role}`).click();

    return this;
  },
  inviteMember(email: string, role = MembershipRole.Member) {
    this.$getInvitationEmailInput().type(email);
    this.selectRole(role);
    this.$getInvitationsSubmitButton().click();

    return this;
  },
  removeMember(email: string) {
    this.$getMemberByEmail(email).within(() => {
      this.openMemberActionsDropdown();
      this.$removeMemberActionButton().click({ force: true });
    });

    cy.cyGet(`confirm-remove-member`).click();

    return this;
  },
  updateMemberRole(email: string, role: MembershipRole) {
    this.$getMemberByEmail(email).within(() => {
      this.openMemberActionsDropdown();
      this.$updateMemberRoleActionButton().click({ force: true });
    });

    this.selectRoleFromRadioGroup(role);
    cy.cyGet(`confirm-update-member-role`).click();

    return this;
  },
  transferOwnership(email: string) {
    this.$getMemberByEmail(email).within(() => {
      this.openMemberActionsDropdown();
      this.$transferOwnershipAction().click({ force: true });
    });
  },
};

export default organizationPageObject;
