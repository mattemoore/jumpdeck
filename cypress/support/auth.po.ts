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
  $getEmailInput: () => cy.cyGet(`email-input`),
  $getPasswordInput: () => cy.cyGet(`password-input`),
  $getSubmitButton: () => cy.cyGet(`auth-submit-button`),
  $getErrorMessage: () => cy.cyGet(`auth-error-message`),
  $oAuthSignInButton: () => cy.cyGet(`oauth-sign-in-button`),
  $getAcceptInviteSubmitButton: () => cy.cyGet(`accept-invite-submit-button`),
  signInWithEmailAndPassword(email: string, password: string) {
    cy.wait(50);

    this.$getEmailInput().type(email);
    this.$getPasswordInput().type(password);
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

    const signIn = signInWithEmailAndPassword(getAuth(), email, password).catch(
      (e) => {
        cy.log(`User could not sign in programmatically`);
        console.error(e);
      }
    );

    cy.wrap(signIn).then((result) => {
      const { user } = result as UserCredential;
      const csrfToken = nanoid(12);

      cy.wrap(user.getIdToken()).then((idToken) => {
        cy.setCookie('csrfToken', csrfToken);

        const sessionSignIn = cy.request('POST', `/api/session/sign-in`, {
          idToken: idToken,
          csrfToken,
        });

        sessionSignIn.then(() => {
          cy.log(`Successfully signed in`);
        });
      });
    });
  },
};

function createFirebaseApp() {
  const env = (varName: string) => Cypress.env(varName) as string;

  const config = {
    apiKey: env('NEXT_PUBLIC_FIREBASE_API_KEY'),
    projectId: env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: env('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    appId: env('NEXT_PUBLIC_FIREBASE_APP_ID'),
  };

  return initializeApp(config);
}

function getAuthEmulatorHost() {
  const host = Cypress.env('NEXT_PUBLIC_FIREBASE_EMULATOR_HOST') as string;
  const port = Cypress.env('NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT') as string;

  return ['http://', host, ':', port].join('');
}

function getAuth() {
  firebaseApp = firebaseApp || createFirebaseApp();

  auth =
    auth ||
    initializeAuth(firebaseApp, {
      persistence: indexedDBLocalPersistence,
    });

  connectAuthEmulator(auth, getAuthEmulatorHost());

  return auth;
}

export default authPageObject;
