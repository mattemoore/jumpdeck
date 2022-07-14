import { MembershipRole } from '~/lib/organizations/types/membership-role';

const $get = cy.cyGet.bind(cy);

const organizationPageObject = {
  $getOrganizationNameInput: () => $get(`organization-name-input`),
  $getUpdateOrganizationSubmitButton: () =>
    $get(`update-organization-submit-button`),
  $currentOrganization: () => $get(`organization-selector`),
  $createOrganizationButton: () => $get(`create-organization-button`),
  $confirmCreateOrganizationButton: () =>
    $get(`confirm-create-organization-button`),
  $createOrganizationNameInput: () => $get(`create-organization-name-input`),
  $getMembers: () => $get(`organization-member`),
  $getMemberByEmail(invitedMemberEmail: string) {
    return this.$getMembers().contains(`[data-cy]`, invitedMemberEmail);
  },
  $getInvitedMembers: () => $get(`invited-member`),
  $getInvitedMemberByEmail(invitedMemberEmail: string) {
    return this.$getInvitedMembers().contains(`[data-cy]`, invitedMemberEmail);
  },
  $getMemberActionsDropdown: () => $get(`member-actions-dropdown`),
  $getInvitationEmailInput: () => $get(`invite-email-input`),
  $getCreateInviteButton: () => $get(`create-invite-button`),
  $getRemoveInviteButton: () => $get(`remove-invite-button`),
  $getInvitationsSubmitButton: () => $get(`send-invites-button`),
  $getDeleteInviteButton: () => $get(`delete-invite-button`),
  $getConfirmDeleteInviteButton: () => $get(`confirm-delete-invite-button`),
  $getRoleSelector: () => $get(`invite-role-selector-button`),
  $getRoleBadge: () => $get(`member-role-badge`),
  $removeMemberActionButton: () => $get(`remove-member-action`),
  $updateMemberRoleActionButton: () => $get(`update-member-role-action`),
  navigateToInviteForm: () => $get(`invite-form-link`).click(),
  switchToOrganization(name: string) {
    this.$currentOrganization().click();

    cy.contains('[data-cy="organization-selector-item"]', name).click();

    return this;
  },
  openMemberActionsDropdown() {
    this.$getMemberActionsDropdown().click();

    // ugly but needed, elements called right after are detached and Cypress
    // doesn't handle it well
    cy.wait(250);

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
  inviteMember(email: string, role = MembershipRole.Member) {
    this.navigateToInviteForm();
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

    this.selectRole(role);
    cy.cyGet(`confirm-update-member-role`).click();

    return this;
  },
};

export default organizationPageObject;
