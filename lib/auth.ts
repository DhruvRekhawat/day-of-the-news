// lib/auth.js
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async signUp({ email, password, name }:{email:string,password:string,name:string}) {
      return { email, password, name }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || " ",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || " ",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "FREE",
        required: false,
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async signUp({ user }: { user: any }) {
      console.log("User signed up:", user.email)
      return { user }
    },
    async signIn({ user }: { user: any }) {
      console.log("User signed in:", user.email)
      return { user }
    },
  },
})

export type Session = typeof auth.$Infer.Session