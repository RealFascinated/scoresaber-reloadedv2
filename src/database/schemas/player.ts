import mongoose from "mongoose";
import { ScoresaberSchema } from "./scoresaberAccount";
const { Schema } = mongoose;

const playerSchema = new Schema({
  _id: String,
  profilePicture: String,
  name: String,
  country: String,

  scoresaber: ScoresaberSchema,
});

export const PlayerSchema =
  mongoose.models.Player || mongoose.model("Player", playerSchema);
