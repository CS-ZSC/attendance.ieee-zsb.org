import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import { requireAuthenticatedUser } from "@/lib/guard";

// GET /api/users/me/teams — list all teams managed by the current user with their members
export async function GET(req: Request) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) {
    return auth;
  }

  await connectDB();

  // Get all teams that this user manages
  const managedTeamIds = auth.managedTeams;

  if (!managedTeamIds || managedTeamIds.length === 0) {
    return NextResponse.json([]);
  }

  // Get all managed teams
  const teams = await Team.find({ _id: { $in: managedTeamIds } }).lean();

  // Get all members for these teams (excluding Board and IB positions)
  const teamData = await Promise.all(
    teams.map(async (team) => {
      const members = await User.find(
        {
          teams: team._id,
          position: { $nin: ["Board", "IB"] },
        },
        "name position"
      ).lean();

      return {
        id: team._id,
        name: team.name,
        members: members.map((member) => ({
          id: member._id,
          name: member.name,
          role: member.position || "member",
        })),
      };
    })
  );

  return NextResponse.json(teamData);
}
