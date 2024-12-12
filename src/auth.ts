import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./actions/auth/user";
import { generateAccessToken } from "./actions/auth/generate-access-token";
import { UserRole } from "@prisma/client";

/**
 *
 * this page includes callback , events , provider
 */

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      isauth: boolean;
      role: UserRole;
    };
    accessToken: string;
  }
}

// declare module "next-auth" {
//   interface User {
//     role: userRole;
//   }
// }

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  secret: process.env.AUTH_SECRET,
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      // check if email is verified
      const existuser = await getUserById(user.id);
      if (!existuser) return false;

      return true;
    },
    async jwt({ token, session, account, trigger }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      // update is here
      if (trigger === "update") {
        console.log("update trigger");
        console.log("update trigger");
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;

        return { ...token, ...session?.user };
      }

      token.isauth = !!(account?.provider !== "credentials");

      if (!account || account?.provider === "credentials") {
        token.accessToken = generateAccessToken(user);
      } else {
        // token.accessToken = account?.accessToken;
        if (account.provider === "google") {
          token.accessToken = account.accessToken;
        } else {
        }
      }
      token.id = user.id;
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.isauth = token.isauth;
        session.accessToken = token.accessToken;
        session.user.id = token.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
