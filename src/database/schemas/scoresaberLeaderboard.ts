import mongoose from "mongoose";
const { Schema } = mongoose;

const scoresaberLeaderboardDifficulty = new Schema({
  leaderboardId: Number,
  difficulty: Number,
  gameMode: String,
  difficultyRaw: String,
});

const scoresaberLeaderboard = new Schema({
  _id: String,
  songHash: String,
  songName: String,
  songSubName: String,
  songAuthorName: String,
  levelAuthorName: String,
  difficulty: scoresaberLeaderboardDifficulty,
  maxScore: Number,
  createdDate: String,
  rankedDate: [String],
  qualifiedDate: [String],
  lovedDate: [String],
  ranked: Boolean,
  qualified: Boolean,
  loved: Boolean,
  maxPP: Number,
  stars: Number,
  positiveModifiers: Boolean,
  plays: Number,
  dailyPlays: Number,
  coverImage: String,
  difficulties: [scoresaberLeaderboardDifficulty],
});

export const ScoreSaberLeaderboard =
  mongoose.models.ScoreSaberLeaderboard ||
  mongoose.model("ScoreSaberLeaderboard", scoresaberLeaderboard);
