import nodemailer from 'nodemailer';

export const isEmailConfigured = (): boolean => {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  return Boolean(
    user &&
    pass &&
    !user.includes('your-email') &&
    !pass.includes('your-app-password') &&
    !pass.includes('your-16-char')
  );
};

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host.includes('gmail')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export const sendEmail = async (options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) => {
  if (!isEmailConfigured()) {
    throw new Error('SMTP is not configured. Set SMTP_USER and SMTP_PASS in server environment variables.');
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
};

export default createTransporter;
