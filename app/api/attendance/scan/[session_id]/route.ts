import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Session } from "@/models/Session";
import { Team } from "@/models/Team";
import { Attendance } from "@/models/Attendance";
import { requireAuthenticatedUser } from "@/lib/guard";

type Params = { params: Promise<{ session_id: string }> };

export async function POST(req: Request, { params }: Params) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) return auth;

  const { session_id } = await params;

  if (!Types.ObjectId.isValid(session_id)) {
    return NextResponse.json(
      { success: false, message: "Session not found" },
      { status: 404 },
    );
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Invalid QR token" },
      { status: 403 },
    );
  }

  await connectDB();

  const session = await Session.findById(session_id).lean();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Session not found" },
      { status: 404 },
    );
  }

  if (session.qr_token !== token) {
    return NextResponse.json(
      { success: false, message: "Invalid QR token" },
      { status: 403 },
    );
  }

  const team = await Team.findById(session.team_id).lean();

  const existing = await Attendance.findOne({
    user_id: auth.id,
    session_id: session._id,
  });

  if (existing && existing.attended) {
    return NextResponse.json(
      { success: false, message: "Attendance already recorded" },
      { status: 409 },
    );
  }

  if (existing) {
    existing.attended = true;
    existing.scanned_at = new Date();
    await existing.save();
  } else {
    await Attendance.create({
      user_id: auth.id,
      session_id: session._id,
      attended: true,
      scanned_at: new Date(),
    });
  }

  return NextResponse.json({
    success: true,
    message: "Attendance recorded successfully",
    session: {
      id: session._id,
      title: session.title,
      team: team?.name ?? "Unknown",
    },
  });
}
