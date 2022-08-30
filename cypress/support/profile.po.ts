export const profilePo = {
  $getDisplayNameInput: () => cy.cyGet(`profile-display-name`),
  $getUpdateEmailForm: () => cy.cyGet(`update-email-form`),
  $getUpdateProfileForm: () => cy.cyGet(`update-profile-form`),
  $getUpdatePasswordForm: () => cy.cyGet('update-password-form'),
  $getNewEmailInput: () => cy.cyGet(`profile-new-email-input`),
  $getRepeatEmailInput: () => cy.cyGet(`profile-repeat-email-input`),
  $getPasswordInput: () => cy.cyGet(`profile-password-input`),
  $getUpdateEmailErrorAlert: () => cy.cyGet(`update-email-error-alert`),
  $getUpdatePasswordErrorAlert: () => cy.cyGet(`update-password-error-alert`),
  $getCurrentPasswordInput: () => cy.cyGet(`current-password`),
  $getNewPasswordInput: () => cy.cyGet(`new-password`),
  $getRepeatNewPasswordInput: () => cy.cyGet(`repeat-new-password`),
};

export default profilePo;
