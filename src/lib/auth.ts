import { db } from "@/db/drizzle";
import { accounts, sessions, user, verificationTokens } from "@/db/schema";
import { sendEmail, sendResetPasswordEmail } from "@/email/sendEmail";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins"
// import { oneTap } from "better-auth/plugins"; 

 
export const auth = betterAuth({
  // appName: 'Sociofy', 
  plugins: [
    nextCookies(),
    organization(),
    // oneTap(),
  ],
  emailVerification: {
    sendVerificationEmail: async ({user, url}) => {
       await sendEmail({
        subject: "Verify your email address",
        url: url,
        user: user,
      });
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true, 
    autoSignIn: false,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 1000 * 60 * 60 * 24, // 1 day
    sendResetPassword: async ({user, url}) => {
      await sendResetPasswordEmail({
        subject: "Reset your password",
        url: url,
        user: user,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      account: accounts,
      session: sessions,
      verification: verificationTokens,
    },
  }), 
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    'https://contentgeniusai-one.vercel.app',
  ],
});
