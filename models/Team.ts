import { Schema, model, models } from "mongoose";

const teamSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const Team = models.Team ?? model("Team", teamSchema);
