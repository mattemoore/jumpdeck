import {
  Auth,
  connectAuthEmulator,
  initializeAuth,
  signInWithEmailAndPassword,
  UserCredential,
  indexedDBLocalPersistence,
} from 'firebase/auth';

import { nanoid } from 'nanoid';
import { FirebaseApp, initializeApp } from 'firebase/app';

let firebaseApp: FirebaseApp;
let auth: Auth;

// we use a namespace not to pollute the IDE with methods from the tests
const authPageObject = {
  getDefaultUserEmail: () => Cypress.env(`USER_EMAIL`) as string,
  getDefaultUserPassword: () => Cypress.env(`USER_PASSWORD`) as string,
  getDefaultUserCredentials: () => {
    return {
      email: authPageObject.getDefaultUserEmail(),
      password: authPageObject.getDefaultUserPassword(),
    };
  },
  $getEmailInput: () => cy.cyGet(`email-input`),
  $getPasswordInput: () => cy.cyGet(`password-input`),
  $getRepeatPasswordInput: () => cy.cyGet(`repeat-password-input`),
  $getSubmitButton: () => cy.cyGet(`auth-submit-button`),
  $getErrorMessage: () => cy.cyGet(`auth-error-message`),
  $getAcceptInviteSubmitButton: () => cy.cyGet(`accept-invite-submit-button`),
  signInWithEmailAndPassword(email: string, password: string) {
    cy.wait(50);

    this.$getEmailInput().type(email);
    this.$getPasswordInput().type(password);
    this.$getSubmitButton().click();
  },
  signUpWithEmailAndPassword(
    email: string,
    password: string,
    repeatPassword?: string
  ) {
    cy.wait(50);

    this.$getEmailInput().type(email);
    this.$getPasswordInput().type(password);
    this.$getRepeatPasswordInput().type(repeatPassword || password);
    this.$getSubmitButton().click();
  },
  signInProgrammatically({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    // let's clean everything up
    cy.clearStorage();

    const auth = getAuth();

    const signIn = signInWithEmailAndPassword(auth, email, password).catch(
      (e) => {
        cy.log(`User could not sign in programmatically`);
        console.error(e);
      }
    );

    cy.wrap(signIn).then((result) => {
      const { user } = result as UserCredential;
      const csrfToken = nanoid(12);

      cy.wrap(user.getIdToken()).then((idToken) => {
        cy.setCookie('csrfToken', csrfToken).request(
          'POST',
          `/api/session/sign-in`,
          {
            idToken: idToken,
            csrfToken,
          }
        );
      });
    });
  },
};

function createFirebaseApp() {
  const env = (varName: string) => Cypress.env(varName) as string;

  const config = {
    apiKey: env('FIREBASE_API_KEY'),
    projectId: env('FIREBASE_PROJECT_ID'),
    storageBucket: env('FIREBASE_STORAGE_BUCKET'),
    appId: env('FIREBASE_APP_ID'),
  };

  return initializeApp(config);
}

function getAuthEmulatorHost() {
  const host = Cypress.env('FIREBASE_EMULATOR_HOST');
  const port = Cypress.env('FIREBASE_AUTH_EMULATOR_PORT');

  return ['http://', host, ':', port].join('');
}

function getAuth() {
  firebaseApp = firebaseApp || createFirebaseApp();

  if (auth) {
    return auth;
  }

  auth = initializeAuth(firebaseApp, {
    persistence: indexedDBLocalPersistence,
  });

  connectAuthEmulator(auth, getAuthEmulatorHost());

  return auth;
}

export default authPageObject;
