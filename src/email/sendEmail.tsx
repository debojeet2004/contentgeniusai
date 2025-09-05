import { User } from 'better-auth';
import { Resend } from 'resend';
import EmailVerification from './_components/emailVerificationTemplet';
import ForgotPasswordEmail from './_components/resetPassword';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  subject: string;
  url: string;
  user: User;
}

export const sendEmail = async ({ subject, url, user }: SendEmailProps) => {
  // console.log('data:' , subject, url, user);
  await resend.emails.send({
    from: "onboarding@resend.dev",
    // to: user.email,
    to: ['delivered@resend.dev'],
    subject: subject,
    react: <EmailVerification url={url} name={user.name} />,
  });
};

export const sendResetPasswordEmail = async ({ subject, url, user }: SendEmailProps) => {
  await resend.emails.send({
    from:  "resetpassword@resend.dev",
    // to: user.email,
    to: ['delivered@resend.dev'],
    subject: subject,
    react: <ForgotPasswordEmail userEmail={user.email} resetUrl={url} username={user.name} />,
  });
};


// from: "onboarding@devorg.com",


