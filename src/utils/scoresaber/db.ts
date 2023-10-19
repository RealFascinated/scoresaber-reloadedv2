import { ScoreSaberLeaderboard } from "@/database/schemas/scoresaberLeaderboard";
import { ScoresaberScore } from "@/database/schemas/scoresaberScore";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";

export async function createScore(
  playerId: string,
  scoreSaberScore: ScoresaberPlayerScore,
) {
  const score = scoreSaberScore.score;
  const leaderboard = scoreSaberScore.leaderboard;

  await ScoresaberScore.create({
    _id: score.id,
    playerId: playerId,
    leaderboardId: leaderboard.id,
    rank: score.rank,
    baseScore: score.baseScore,
    modifiedScore: score.modifiedScore,
    pp: score.pp,
    weight: score.weight,
    modifiers: score.modifiers,
    multiplier: score.multiplier,
    badCuts: score.badCuts,
    missedNotes: score.missedNotes,
    maxCombo: score.maxCombo,
    fullCombo: score.fullCombo,
    hmd: score.hmd,
    hasReply: score.hasReply,
    timeSet: new Date(score.timeSet).getTime(),
  });

  await ScoreSaberLeaderboard.updateOne(
    { _id: leaderboard.id },
    {
      _id: leaderboard.id,
      songHash: leaderboard.songHash,
      songName: leaderboard.songName,
      songSubName: leaderboard.songSubName,
      songAuthorName: leaderboard.songAuthorName,
      levelAuthorName: leaderboard.levelAuthorName,
      difficulty: leaderboard.difficulty,
      maxScore: leaderboard.maxScore,
      createdDate: leaderboard.createdDate,
      rankedDate: leaderboard.rankedDate,
      qualifiedDate: leaderboard.qualifiedDate,
      lovedDate: leaderboard.lovedDate,
      ranked: leaderboard.ranked,
      qualified: leaderboard.qualified,
      loved: leaderboard.loved,
      maxPP: leaderboard.maxPP,
      stars: leaderboard.stars,
      positiveModifiers: leaderboard.positiveModifiers,
      plays: leaderboard.plays,
      dailyPlays: leaderboard.dailyPlays,
      coverImage: leaderboard.coverImage,
      difficulties: leaderboard.difficulties,
    },
    { upsert: true },
  );
}

export async function updateScore(
  playerId: string,
  scoreSaberScore: ScoresaberPlayerScore,
) {
  const score = scoreSaberScore.score;
  const leaderboard = scoreSaberScore.leaderboard;

  // Delete the old score
  await ScoresaberScore.deleteOne({ _id: score.id });

  // Create the new score
  await ScoresaberScore.create({
    _id: score.id,
    playerId: playerId,
    leaderboardId: leaderboard.id,
    rank: score.rank,
    baseScore: score.baseScore,
    modifiedScore: score.modifiedScore,
    pp: score.pp,
    weight: score.weight,
    modifiers: score.modifiers,
    multiplier: score.multiplier,
    badCuts: score.badCuts,
    missedNotes: score.missedNotes,
    maxCombo: score.maxCombo,
    fullCombo: score.fullCombo,
    hmd: score.hmd,
    hasReply: score.hasReply,
    timeSet: score.timeSet,
  });
}
