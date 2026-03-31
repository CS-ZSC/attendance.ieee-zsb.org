import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
import { Attendance } from "@/models/Attendance";
import { inTeam, isTnTBoard, isTnTMember, requireAuthenticatedUser } from "@/lib/guard";

const slugToTeamName: Record<string, string> = {
  ambassadors: "Ambassadors",
  "business-development": "Business Development (BD)",
  cs: "CS (Computer Society)",
  multimedia: "Multimedia",
  operations: "Operations",
  pes: "PES (Power & Energy Society)",
  ras: "RAS (Robotics & Automation Society)",
  "talent-and-tech": "Talent & Tech (T&T)",
  wie: "WIE (Women in Engineering)",
};

type Params = { params: Promise<{ team_name: string; session_id: string }> };

export async function GET(req: Request, { params }: Params) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) return auth;

  const { team_name, session_id } = await params;

  if (!Types.ObjectId.isValid(session_id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await connectDB();

  const realName = slugToTeamName[team_name];
  if (!realName)
    return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const team = await Team.findOne({ name: realName });
  if (!team)
    return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (!inTeam(auth, team.name)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await Session.findOne({
    _id: session_id,
    team_id: team._id,
  }).lean();
  if (!session)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const [members, records] = await Promise.all([
    User.find(
      {
        teams: team._id,
        position: { $nin: ["Internal Board", "Board", "internal board", "board", "Internal board"] },
      },
      "name email"
    ).lean(),
    Attendance.find({ session_id: session._id }).lean(),
  ]);

  const attendedSet = new Set(
    records.filter((r) => r.attended).map((r) => r.user_id.toString()),
  );

  const isBoard = /board|internal board/i.test(auth.position || "");
  const canEdit = isTnTBoard(auth) || isTnTMember(auth);

  return NextResponse.json({
    canEdit,
    session: {
      id: session._id,
      title: session.title,
      team: team.name,
      qr_token: session.qr_token,
      created_at: new Date(session.created_at).toLocaleDateString("en-CA"),
    },
    users: members.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      attended: attendedSet.has(u._id.toString()),
    })),
  });
}
