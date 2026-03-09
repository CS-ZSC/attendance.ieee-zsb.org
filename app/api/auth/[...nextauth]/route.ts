import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AuthUser {
  id: string;
  email: string;
  teams: string[];
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        nationalId: { label: "National ID", type: "text" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.nationalId) return null;

        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/verify-user`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                nationalId: credentials.nationalId,
              }),
            },
          );

          if (!response.ok) {
            console.error("Verify user API error:", response.statusText);
            return null;
          }

          const user: AuthUser = await response.json();
          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;
        token.id = u.id;
        token.teams = u.teams;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.teams = token.teams;
      }
      return session;
    },
  },
} as NextAuthOptions);

export { handler as GET, handler as POST };
