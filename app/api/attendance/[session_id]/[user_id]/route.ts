import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/Attendance";
import { Session } from "@/models/Session";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import { requireAuthenticatedUser, isTnTBoard, isTnTMember } from "@/lib/guard";
import { Types } from "mongoose";

type Params = { params: Promise<{ session_id: string; user_id: string }> };

export async function PATCH(req: Request, { params }: Params) {
    const auth = await requireAuthenticatedUser(req);
    if (auth instanceof Response) return auth;

    const { session_id, user_id } = await params;

    if (!Types.ObjectId.isValid(session_id) || !Types.ObjectId.isValid(user_id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await connectDB();

    // Find session and team to check permissions
    const session = await Session.findById(session_id);
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const team = await Team.findById(session.team_id);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    if (!isTnTBoard(auth) && !isTnTMember(auth)) {
        return NextResponse.json({ error: "Forbidden: T&T Management Only" }, { status: 403 });
    }

    const { attended } = await req.json();

    const attendance = await Attendance.findOneAndUpdate(
        { session_id, user_id },
        {
            attended,
            scanned_at: attended ? new Date() : null
        },
        { upsert: true, new: true }
    );

    return NextResponse.json({
        success: true,
        attended: attendance.attended
    });
}
