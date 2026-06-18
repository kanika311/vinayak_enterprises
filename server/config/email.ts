import nodemailer from 'nodemailer';

export const isEmailConfigured = (): boolean => {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  return Boolean(
    user &&
    pass &&
    !user.includes('your-email') &&
    !pass.includes('your-app-password')
  );
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) => {
  if (!isEmailConfigured()) {
    throw new Error('SMTP is not configured. Set SMTP_USER and SMTP_PASS in backend .env');
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
};

export default transporter;
