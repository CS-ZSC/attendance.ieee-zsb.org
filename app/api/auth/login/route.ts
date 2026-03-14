import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Team } from "@/models/Team";

// Must match the cookie name NextAuth assigns so getServerSession can decode it
const COOKIE_NAME = process.env.NEXTAUTH_URL?.startsWith("https://")
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

const MAX_AGE = 30 * 24 * 60 * 60; // 30 days (NextAuth default)

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.email || !body?.nationalId) {
    return NextResponse.json(
      { error: "email and nationalId are required" },
      { status: 400 },
    );
  }

  await connectDB();

  Team;

  const user = await User.findOne({
    email: body.email,
    national_id: body.nationalId,
  })
    .populate("teams", "name")
    .populate("managedTracks", "name")
    .lean();

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const userData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    teams: (user.teams ?? []).map((t: any) => t?.name || String(t)),
    managedTracks: (user.managedTracks ?? []).map((m: any) => m?.name || String(m)),
  };

  // Encode a NextAuth-compatible JWT.
  // getToken() internally calls decode() without a salt (defaults to ""),
  // so we must encode without salt too to stay compatible.
  const token = await encode({
    token: {
      sub: userData.id,
      id: userData.id,
      name: userData.name,
      email: userData.email,
      teams: userData.teams,
      managedTracks: userData.managedTracks,
    },
    secret: process.env.NEXTAUTH_SECRET!,
    maxAge: MAX_AGE,
  });

  const response = NextResponse.json({
    user: userData,
    message: "Login successful",
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
  });

  return response;
}
