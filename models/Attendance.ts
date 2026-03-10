import { Schema, model, models, Types } from "mongoose";

const attendanceSchema = new Schema({
  user_id:    { type: Types.ObjectId, ref: "User",    required: true },
  session_id: { type: Types.ObjectId, ref: "Session", required: true },
  attended:   { type: Boolean,        required: true, default: false },
  scanned_at: { type: Date },
});

attendanceSchema.index({ user_id: 1, session_id: 1 }, { unique: true });

export const Attendance = models.Attendance ?? model("Attendance", attendanceSchema);
