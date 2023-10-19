import mongoose from "mongoose";
const { Schema } = mongoose;

const badgeSchema = new Schema({
  image: String,
  description: String,
});

const scoreStatsSchema = new Schema({
  totalScore: Number,
  totalRankedScore: Number,
  averageRankedAccuracy: Number,
  totalPlayCount: Number,
  rankedPlayCount: Number,
  replaysWatched: Number,
});

export const ScoresaberSchema = new Schema({
  pp: Number,
  rank: Number,
  countryRank: Number,
  role: String,
  badges: [badgeSchema],
  histories: String,
  scoreStats: scoreStatsSchema,
  permissions: Number,
  banned: Boolean,
  inactive: Boolean,
});
