import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Team } from "@/models/Team";

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
          Team; // Ensure Team model is registered
          const user = await User.findOne({
            email: credentials?.email,
            national_id: credentials?.nationalId,
          })
            .populate("teams", "name")
            .populate("managedTracks", "name")
            .lean();

          if (!user) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            teams: (user.teams || []).map((team: any) => team?.name || String(team)),
            managedTracks: (user.managedTracks || []).map((m: any) => m?.name || String(m)),
            position: user.position,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.teams = user.teams;
        token.managedTracks = user.managedTracks;
        token.position = user.position;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.teams = token.teams ?? [];
        session.user.managedTracks = token.managedTracks ?? [];
        session.user.position = token.position;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};
