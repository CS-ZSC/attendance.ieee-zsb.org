import { Schema, model, models, Types } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  national_id: { type: String, required: true, unique: true },
  phone: { type: String },
  position: { type: String },
  teams: [{ type: Types.ObjectId, ref: "Team" }],
  managedTracks: [{ type: Types.ObjectId, ref: "Team" }],
});

export const User = models.User ?? model("User", userSchema);
