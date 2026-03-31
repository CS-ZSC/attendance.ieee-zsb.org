import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import { requireAuthenticatedUser } from "@/lib/guard";

// Team categories mapping
const teamCategories: Record<string, string> = {
  Ambassadors: "committee",
  "Business Development (BD)": "committee",
  "CS (Computer Society)": "chapter",
  Multimedia: "committee",
  Operations: "committee",
  "PES (Power & Energy Society)": "chapter",
  "RAS (Robotics & Automation Society)": "chapter",
  "Talent & Tech (T&T)": "committee",
  "WIE (Women in Engineering)": "track",
};

// Slug mapping for URL-friendly names
const nameToSlug: Record<string, string> = {
  Ambassadors: "ambassadors",
  "Business Development (BD)": "business-development",
  "CS (Computer Society)": "cs",
  Multimedia: "multimedia",
  Operations: "operations",
  "PES (Power & Energy Society)": "pes",
  "RAS (Robotics & Automation Society)": "ras",
  "Talent & Tech (T&T)": "talent-and-tech",
  "WIE (Women in Engineering)": "wie",
};

// GET /api/teams — list all teams (chapters, committees, tracks)
export async function GET(req: Request) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) return auth;

  await connectDB();

  const user = await User.findById(auth.id)
    .select("teams managedTracks position")
    .populate("teams", "name")
    .lean();

  const isTnTBoard =
    user?.teams?.some((t: any) => t.name === "Talent & Tech (T&T)") &&
    /board|head|chair|director/i.test(user?.position || "");

  const allowedTeamIds = [
    ...(user?.teams?.map((t: any) => t._id) || []),
    ...(user?.managedTracks || []),
  ];

  let teams: any[] = [];
  if (isTnTBoard) {
    teams = await Team.find().lean();
  } else if (allowedTeamIds.length > 0) {
    teams = await Team.find({ _id: { $in: allowedTeamIds } }).lean();
  }

  const chapters: { id: unknown; name: string; slug: string }[] = [];
  const committees: { id: unknown; name: string; slug: string }[] = [];
  const tracks: { id: unknown; name: string; slug: string }[] = [];

  for (const team of teams) {
    const teamData = {
      id: team._id,
      name: team.name,
      slug: nameToSlug[team.name] ?? team.name.toLowerCase().replace(/\s+/g, "-"),
    };

    const category = teamCategories[team.name] ?? "committee";
    if (category === "chapter") {
      chapters.push(teamData);
    } else if (category === "track") {
      tracks.push(teamData);
    } else {
      committees.push(teamData);
    }
  }

  return NextResponse.json({
    chapters,
    committees,
    tracks,
    all: [...chapters, ...committees, ...tracks],
  });
}
