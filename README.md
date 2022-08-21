# MakerKit - SaaS Starter for Next.js and Firebase

MakerKit is a SaaS starter project built with Next.js, Firebase and Tailwind 
CSS.

## Quick Start

Clone this repository and name it according to your preferences:

```
git clone https://github.com/makerkit/next-firebase-saas-kit.git your-saas 
--depth=1
```

Move to the folder just cloned:

```
cd your-saas 
```

Reinitialize Git and set this repository as your upstream fork, so you can 
pull updates when needed:

```
rm -rf .git
git init
git remote add upstream https://github.com/makerkit/next-firebase-saas-kit
```

Subscribe to the repository so you can pull the updates. To do so, you can 
either pull the latest version:

```
git pull upstream main
```

In case we change the same files, you will need to resolve the conflicts.

Alternatively, you can cherry-pick changes so to reduce the amount of 
conflicts across the files.

### Installing the Node Modules

Install the Node modules with the following command:

```
npm i
```

### Starting the Next.js server and the Firebase Emulators

Start the application and the Firebase emulators:

```
npm run dev
firebase:emulators:start
```

The application should be running at [http://localhost:3000](http://localhost:3000).

If you're testing Stripe, also run the Stripe server:

```
npm run stripe:listen
```

Then, copy the printed webhook key and add it to your environment files. 
This can also be used for running the E2E tests.
My recommendation is to add it to both `.env.test` and `.env.development`.

### After Creating your Firebase Project

Make sure to update the environment files

### Running Tests

To run the Cypress tests, please run the command:

```
npm test
```

NB: this command will start all the services required, execute the tests and 
then exit.

#### Stripe Testing

To run the Stripe tests and enable Stripe in development mode, you need to:

1. Enable the tests using the environment variable `ENABLE_STRIPE_TESTING` in 
`.env.test`
2. Have Docker installed and running in your local machine to run the Stripe 
  Emulator
3. Generate a webhook key and set the environment variable 
   `STRIPE_WEBHOOK_SECRET`

The first two steps are only required to run the Cypress E2E tests for 
Stripe. Generating a webhook key and running the Stripe CLI server is 
always required for developing your Stripe functionality locally.

To generate a webhook key, run the following command:

```
npm run stripe:listen
```

If it worked, it will print the webhook key. Then, paste it into 
your environment files as `STRIPE_WEBHOOK_SECRET`. 

This key is also needed to run Stripe during development to receive the 
Stripe webhooks to your local server.

```
ENABLE_STRIPE_TESTING=true
```

### Full Documentation
To continue setting up your application, please take a look at [the official 
documentation](https://makerkit.dev/docs/setting-up-firebase).
