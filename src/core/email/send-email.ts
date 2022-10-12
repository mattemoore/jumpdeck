import configuration from '../../configuration';

interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(config: SendEmailParams) {
  const transporter = await getTransporter();

  return transporter.sendMail(config);
}

function getTransporter() {
  if (process.env.IS_CI) {
    return getMockMailTransporter();
  }

  if (configuration.emulator) {
    return getEtherealMailTransporter();
  }

  return getSMTPTransporter();
}

/**
 * @description SMTP Transporter for production use. Add your favorite email
 * API details (Mailgun, Sendgrid, etc.) to the configuration.
 */
async function getSMTPTransporter() {
  const nodemailer = await import('nodemailer');

  const { host, port, user, password: pass } = configuration.email;
  const secure = port === 465 && !configuration.emulator;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * @description Dev transport for https://ethereal.email that you can use to
 * debug your emails for free. It's the default for the dev environment
 */
async function getEtherealMailTransporter() {
  const nodemailer = await import('nodemailer');
  const testAccount = await getEtherealTestAccount();

  const host = 'smtp.ethereal.email';
  const port = 587;

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

function getMockMailTransporter() {
  return {
    sendMail(params: SendEmailParams) {
      console.log(
        `Using mock email transporter with params`,
        JSON.stringify(params, null, 2)
      );
    },
  };
}

async function getEtherealTestAccount() {
  const testAccount = configuration.emailEtherealTestAccount;

  // if we have added an Ethereal account, we reuse these credentials to
  // send the email
  if (testAccount?.email && testAccount?.password) {
    console.log(`Sending email with Ethereal test account...`);

    return {
      user: testAccount.email,
      pass: testAccount.password,
    };
  }

  // Otherwise, we create a new account and recommend to add the credentials
  // to the configuration file
  return createEtherealTestAccount();
}

async function createEtherealTestAccount() {
  const nodemailer = await import('nodemailer');
  const newAccount = await nodemailer.createTestAccount();

  console.warn(`
    Configuration property "emailEtherealTestAccount" was not found! 
    Consider adding a fixed Ethereal account so that you don't need to update the credentials each time you use it.
    To do so, please use the guide at https://makerkit.dev/docs/email
  `);

  console.log(
    `Created Ethereal test account: ${JSON.stringify(newAccount, null, 2)}`
  );

  console.log(`Consider adding these credentials to your configuration file`);

  return newAccount;
}
