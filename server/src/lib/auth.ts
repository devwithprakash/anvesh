import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db.js";
import { sendEmail } from "./email.js";

const clientUrl = process.env.FRONTEND_URL || "http://localhost:3000";

function addOneMonth(date: Date): Date {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() + 1);
  return d;
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [clientUrl],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Seed a UsageRecords row for every new user so quota checks work
          // from the very first action.
          const now = new Date();
          const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const periodEnd = addOneMonth(periodStart);

          await prisma.usageRecords.upsert({
            where: { userId: user.id },
            update: {},
            create: {
              userId: user.id,
              workspaces: 0,
              AiQueries: 0,
              periodStart,
              periodEnd,
            },
          });
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,

    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <h2>Reset your password</h2>
          <p>Click the button below to reset your password.</p>

          <a href="${url}">
            Reset Password
          </a>

          <p>This link will expire in 1 hour.</p>
        `,
      });
    },

    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,

    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
          <h2>Verify your email</h2>

          <p>Welcome! Please verify your email address.</p>

          <a href="${url}">
            Verify Email
          </a>

          <p>This link will expire in 1 hour.</p>
        `,
      });
    },

    expiresIn: 60 * 60,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
