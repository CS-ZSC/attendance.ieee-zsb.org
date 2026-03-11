import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        nationalId: { label: "National ID", type: "text" },
      },
      async authorize(credentials) {
        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/verify-user`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              nationalId: credentials?.nationalId,
            }),
          },
        );

        const user = await response.json();
        if (response.ok && user) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};
