import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import { Session } from "@/models/Session";

type Params = { params: Promise<{ team_name: string }> };

// GET /api/sessions/[team_name] — list all sessions for a team
export async function GET(_req: Request, { params }: Params) {
  const { team_name } = await params;
  await connectDB();

  const team = await Team.findOne({ name: new RegExp(`^${decodeURIComponent(team_name)}$`, "i") });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const sessions = await Session.find({ team_id: team._id })
    .populate("created_by", "name")
    .sort({ created_at: -1 })
    .lean();

  type PopulatedSession = { _id: unknown; title: string; created_by: { name: string }; created_at: Date };

  return NextResponse.json(
    (sessions as PopulatedSession[]).map((s) => ({
      id: s._id,
      title: s.title,
      created_by: s.created_by.name,
      created_at: new Date(s.created_at).toISOString().split("T")[0],
    })),
  );
}

// POST /api/sessions/[team_name] — create a session (Talent & Tech only)
export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  // Check user belongs to Talent & Tech
  const tnt = await Team.findOne({ name: /talent.*tech/i });
  const user = await User.findById((session.user as { id: string }).id);
  if (!tnt || !user?.teams.some((t: unknown) => (t as { equals: (v: unknown) => boolean }).equals(tnt._id))) {
    return NextResponse.json({ error: "Forbidden: Talent & Tech only" }, { status: 403 });
  }

  const { team_name } = await params;
  const team = await Team.findOne({ name: new RegExp(`^${decodeURIComponent(team_name)}$`, "i") });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const { title } = await req.json();
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const newSession = await Session.create({
    title,
    team_id: team._id,
    created_by: user._id,
    qr_token: crypto.randomUUID(),
  });

  return NextResponse.json({ id: newSession._id, title: newSession.title, qr_token: newSession.qr_token }, { status: 201 });
}
