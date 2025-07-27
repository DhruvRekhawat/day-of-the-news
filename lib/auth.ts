import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",

    
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async signUp({ email, name }: { email: string; name: string }) {
     
      // Create user with password
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role: "FREE",
        },
        include: {
          accounts: true
        }
      });

      return { user };
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
  trustedOrigins: [
    "http://localhost:3000",
    "https://day-of-the-news.vercel.app",
  ],
  callbacks: {
    async signUp({ user }: { user: any }) {
      console.log("User signed up:", user.email);
      return { user };
    },
    async signIn({ user }: { user: any }) {
      console.log("User signed in:", user.email);
      return { user };
    },
  },
});

export type Session = typeof auth.$Infer.Session;