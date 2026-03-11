import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import { Session } from "@/models/Session";
import { Attendance } from "@/models/Attendance";

type Params = { params: Promise<{ team_name: string; session_id: string }> };

// GET /api/sessions/[team_name]/[session_id] — session details + attendance status
export async function GET(_req: Request, { params }: Params) {
  const { team_name, session_id } = await params;
  await connectDB();

  const team = await Team.findOne({ name: new RegExp(`^${decodeURIComponent(team_name)}$`, "i") });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const session = await Session.findOne({ _id: session_id, team_id: team._id }).lean();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  // All members of the team + their attendance for this session
  const [members, records] = await Promise.all([
    User.find({ teams: team._id }, "name email").lean(),
    Attendance.find({ session_id: session._id }).lean(),
  ]);

  const attendedSet = new Set(records.filter((r) => r.attended).map((r) => r.user_id.toString()));

  return NextResponse.json({
    session: {
      id: session._id,
      title: session.title,
      team: team.name,
      qr_token: session.qr_token,
    },
    users: members.map((u) => ({
      name: u.name,
      email: u.email,
      attended: attendedSet.has(u._id.toString()),
    })),
  });
}
