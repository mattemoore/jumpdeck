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

  return nodemailer.createTransport({
    host: configuration.email.host,
    port: configuration.email.port,
    secure: true,
    auth: {
      user: configuration.email.user,
      pass: configuration.email.password,
    },
  });
}

/**
 * @description Dev transport for https://ethereal.email that you can use to
 * debug your emails for free. It's the default for the dev enviornment
 */
async function getEtherealMailTransporter() {
  const nodemailer = await import('nodemailer');
  const testAccount = await nodemailer.createTestAccount();

  console.log(
    `Sending email with Ethereal test account: ${JSON.stringify(
      testAccount,
      null,
      2
    )}`
  );

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
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
        `Mock email transporter wit params`,
        JSON.stringify(params, null, 2)
      );
    },
  };
}
