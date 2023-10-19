import mongoose from "mongoose";
const { Schema } = mongoose;

const scoresaberScore = new Schema({
  _id: String,
  playerId: String,
  leaderboardId: String,
  rank: Number,
  baseScore: Number,
  modifiedScore: Number,
  pp: Number,
  weight: Number,
  modifiers: String,
  multiplier: Number,
  badCuts: Number,
  missedNotes: Number,
  maxCombo: Number,
  fullCombo: Boolean,
  hmd: Number,
  hasReply: Boolean,
  timeSet: String,
});

export const ScoresaberScore =
  mongoose.models.ScoreSaberScores ||
  mongoose.model("ScoreSaberScores", scoresaberScore);
