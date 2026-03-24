import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Team } from "@/models/Team";
import { Session } from "@/models/Session";
import { Attendance } from "@/models/Attendance";
import { requireAuthenticatedUser } from "@/lib/guard";

// GET /api/user/me — get current user details with teams, sessions, and attendance status
export async function GET(req: Request) {
  const auth = await requireAuthenticatedUser(req);
  if (auth instanceof Response) return auth;

  await connectDB();

  const user = await User.findById(auth.id)
    .populate("teams", "name")
    .populate("managedTracks", "name")
    .lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get all team IDs for the user
  const teamIds = (user.teams ?? []).map((t: any) => t._id);

  // Get all sessions for user's teams
  const sessions = await Session.find({ team_id: { $in: teamIds } })
    .populate("team_id", "name")
    .populate("created_by", "name")
    .sort({ created_at: -1 })
    .lean();

  // Get attendance records for this user
  const sessionIds = sessions.map((s) => s._id);
  const attendanceRecords = await Attendance.find({
    user_id: user._id,
    session_id: { $in: sessionIds },
  }).lean();

  // Create a map of session_id -> attendance record
  const attendanceMap = new Map(
    attendanceRecords.map((a) => [a.session_id.toString(), a]),
  );

  // Build session details with attendance status
  type PopulatedSession = {
    _id: unknown;
    title: string;
    team_id: { _id: unknown; name: string } | null;
    created_by: { name: string } | null;
    created_at: Date;
  };

  const sessionsWithAttendance = (sessions as PopulatedSession[]).map((s) => {
    const attendance = attendanceMap.get(s._id!.toString());
    return {
      id: s._id,
      title: s.title,
      team: s.team_id?.name ?? "Unknown",
      created_by: s.created_by?.name ?? "Unknown",
      created_at: new Date(s.created_at).toLocaleDateString("en-CA"),
      attended: attendance?.attended ?? false,
      scanned_at: attendance?.scanned_at
        ? new Date(attendance.scanned_at).toISOString()
        : null,
    };
  });

  // Calculate attendance statistics
  const totalSessions = sessions.length;
  const attendedSessions = attendanceRecords.filter((a) => a.attended).length;
  const attendanceRate =
    totalSessions > 0
      ? Math.round((attendedSessions / totalSessions) * 100)
      : 0;

  return NextResponse.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      position: user.position ?? null,
      teams: (user.teams ?? []).map((t: any) => ({
        id: t._id,
        name: t.name,
      })),
      managedTracks: (user.managedTracks ?? []).map((t: any) => ({
        id: t._id,
        name: t.name,
      })),
    },
    attendance: {
      totalSessions,
      attendedSessions,
      attendanceRate,
    },
    sessions: sessionsWithAttendance,
  });
}
