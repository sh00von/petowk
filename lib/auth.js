// Create a separate file for authOptions to avoid export issues
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./mongodb"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,

      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url)
        const nodemailer = require("nodemailer")

        const transport = nodemailer.createTransport(provider.server)

        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: "🐾 Sign in to PETOWK - Your AI Pet Assistant",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4f46e5;">🐶 Welcome to PETOWK</h2>
              <p>Hi there! You're just one click away from accessing <strong>PETOWK</strong>, your personalized AI assistant for your furry, feathered, or scaly friend.</p>
              <p>Click the button below to sign in securely:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Sign in to PETOWK
              </a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${url}" style="color: #4f46e5;">${url}</a></p>
              <hr style="margin-top: 32px;" />
              <p style="font-size: 12px; color: #777;">You received this email because someone attempted to sign in to PETOWK using this address. If this wasn't you, no action is needed.</p>
              <p style="font-size: 12px; color: #777;">🐾 Powered by PETOWK • AI Pet Assistant</p>
            </div>
          `,
          text: `Sign in to PETOWK\n${url}`,
        })
      },
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
    async signIn({ user, account, profile }) {
      return true
    },
  },
}

