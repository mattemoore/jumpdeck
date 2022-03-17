import configuration from '../../configuration';

export async function sendEmail(config: {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const transporter = await getTransporter();

  return transporter.sendMail(config);
}

function getTransporter() {
  if (configuration.emulator) {
    return getMockTransporter();
  }

  return getSMTPTransporter();
}

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

async function getMockTransporter() {
  const nodemailer = await import('nodemailer');
  const testAccount = await nodemailer.createTestAccount();

  console.log(
    `Sending email with test account: ${JSON.stringify(testAccount, null, 2)}`
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
