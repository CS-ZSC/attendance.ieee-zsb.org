import { Schema, model, models, Types } from "mongoose";

const sessionSchema = new Schema({
  title: { type: String, required: true },
  track: { type: String },
  team_id: { type: Types.ObjectId, ref: "Team", required: true },
  created_by: { type: Types.ObjectId, ref: "User", required: true },
  qr_token: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

export const Session = models.Session ?? model("Session", sessionSchema);
