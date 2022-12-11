import {
  Auth,
  connectAuthEmulator,
  initializeAuth,
  signInWithEmailAndPassword,
  indexedDBLocalPersistence,
} from 'firebase/auth';

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
  signInProgrammatically(params: { email: string; password: string }) {
    cy.wrap(getIdToken(params)).then((idToken) => {
      fetchSessionId(idToken as string);
    });
  },
};

function getIdToken({ email, password }: { email: string; password: string }) {
  return signInWithEmailAndPassword(getAuth(), email, password).then(
    (response) => {
      if (!response) {
        return Promise.reject(`No id token found`);
      }

      return response.user.getIdToken();
    }
  );
}

function fetchSessionId(idToken: string) {
  const body = {
    idToken: idToken,
  };

  cy.log(`Executing Session ID request...`);

  cy.request({
    method: 'POST',
    url: `/api/session/sign-in`,
    body,
    headers: {
      'x-csrf-token': `MOCKCSRFTOKEN`,
    },
  });
}

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
