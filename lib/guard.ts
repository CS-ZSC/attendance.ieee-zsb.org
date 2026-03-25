import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  teams: string[];
  managedTeams: string[];
};

const COOKIE_NAME = process.env.NEXTAUTH_URL?.startsWith("https://")
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

export async function requireAuthenticatedUser(
  req: Request,
): Promise<AppUser | Response> {
  const token = await getToken({
    req: req as NextRequest,
    secret: process.env.NEXTAUTH_SECRET!,
    cookieName: COOKIE_NAME,
  });

  if (!token?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return {
    id: token.id as string,
    name: (token.name as string) ?? "",
    email: (token.email as string) ?? "",
    teams: (token.teams as string[]) ?? [],
    managedTeams: (token.managedTeams as string[]) ?? [],
  };
}

export function inTeam(user: AppUser, teamId: string) {
  return user.teams.includes(teamId);
}
