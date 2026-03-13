import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
import { Attendance } from "@/models/Attendance";
import { inTeam, requireAuthenticatedUser } from "@/lib/guard";

type Params = { params: Promise<{ team_name: string; session_id: string }> };

// GET /api/sessions/[team_name]/[session_id] — session details + attendance status (authenticated users only)
export async function GET(req: Request, { params }: Params) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) {
    return auth;
  }

  const { team_name, session_id } = await params;

  if (!Types.ObjectId.isValid(session_id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await connectDB();

  const name = decodeURIComponent(team_name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const team = await Team.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (!inTeam(auth, team._id.toString())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
