import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        nationalId: { label: "National ID", type: "text" },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await User.findOne({
            email: credentials?.email,
            national_id: credentials?.nationalId,
          }).lean();

          if (!user) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            teams: (user.teams || []).map((team: unknown) => String(team)),
            managedTeams: (user.managedTeams || []).map((team: unknown) => String(team)),
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.teams = user.teams;
        token.managedTeams = user.managedTeams;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.teams = token.teams ?? [];
        session.user.managedTeams = token.managedTeams ?? [];
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};
