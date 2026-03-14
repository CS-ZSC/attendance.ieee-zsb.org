import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { Session } from "@/models/Session";
import { inTeam, requireAuthenticatedUser } from "@/lib/guard";

type Params = { params: Promise<{ team_name: string }> };

// GET /api/sessions/[team_name] — list all sessions for a team
export async function GET(req: Request, { params }: Params) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) {
    return auth;
  }

  const { team_name } = await params;
  await connectDB();

  const name = decodeURIComponent(team_name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const team = await Team.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (!inTeam(auth, team._id.toString())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sessions = await Session.find({ team_id: team._id })
    .populate("created_by", "name")
    .sort({ created_at: -1 })
    .lean();

  type PopulatedSession = { _id: unknown; title: string; created_by: { name: string } | null; created_at: Date };

  return NextResponse.json(
    (sessions as PopulatedSession[]).map((s) => ({
      id: s._id,
      title: s.title,
      created_by: s.created_by?.name ?? "Unknown",
      created_at: new Date(s.created_at).toISOString().split("T")[0],
    })),
  );
}

// POST /api/sessions/[team_name] — create a session (authenticated users with team access only)
export async function POST(req: Request, { params }: Params) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) {
    return auth;
  }

  await connectDB();

  const { team_name } = await params;
  const name = decodeURIComponent(team_name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const team = await Team.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (!inTeam(auth, team._id.toString())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title } = await req.json();
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const newSession = await Session.create({
    title,
    team_id: team._id,
    created_by: auth.id,
    qr_token: crypto.randomUUID(),
  });

  return NextResponse.json({ id: newSession._id, title: newSession.title, qr_token: newSession.qr_token }, { status: 201 });
}
