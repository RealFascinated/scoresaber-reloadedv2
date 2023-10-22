// Yoinked from https://github.com/Shurdoof/pp-calculator/blob/c24b5ca452119339928831d74e6d603fb17fd5ef/src/lib/pp/calculator.ts
// Thank for for this I have no fucking idea what the maths is doing but it works!

import { usePlayerScoresStore } from "@/store/playerScoresStore";

export const WEIGHT_COEFFICIENT = 0.965;

const starMultiplier = 42.11;
const ppCurve = [
  [1, 7],
  [0.999, 6.24],
  [0.9975, 5.31],
  [0.995, 4.14],
  [0.9925, 3.31],
  [0.99, 2.73],
  [0.9875, 2.31],
  [0.985, 2.0],
  [0.9825, 1.775],
  [0.98, 1.625],
  [0.9775, 1.515],
  [0.975, 1.43],
  [0.9725, 1.36],
  [0.97, 1.3],
  [0.965, 1.195],
  [0.96, 1.115],
  [0.955, 1.05],
  [0.95, 1],
  [0.94, 0.94],
  [0.93, 0.885],
  [0.92, 0.835],
  [0.91, 0.79],
  [0.9, 0.75],
  [0.875, 0.655],
  [0.85, 0.57],
  [0.825, 0.51],
  [0.8, 0.47],
  [0.75, 0.4],
  [0.7, 0.34],
  [0.65, 0.29],
  [0.6, 0.25],
  [0.0, 0.0],
];

function clamp(value: number, min: number, max: number) {
  if (min !== null && value < min) {
    return min;
  }

  if (max !== null && value > max) {
    return max;
  }

  return value;
}

function lerp(v0: number, v1: number, t: number) {
  return v0 + t * (v1 - v0);
}

function calculatePPModifier(c1: Array<any>, c2: Array<any>, acc: number) {
  const distance = (c2[0] - acc) / (c2[0] - c1[0]);
  return lerp(c2[1], c1[1], distance);
}

function findPPModifier(acc: number, curve: Array<any>) {
  acc = clamp(acc, 0, 100) / 100;

  let prev = curve[1];
  for (const item of curve) {
    if (item[0] <= acc) {
      return calculatePPModifier(item, prev, acc);
    }
    prev = item;
  }
}

export function getScoreSaberPP(acc: number, stars: number) {
  const ppValue = stars * starMultiplier;
  const modifier = findPPModifier(acc * 100, ppCurve);
  if (!modifier) return undefined;

  const finalPP = modifier * ppValue;
  return {
    pp: Number.isNaN(finalPP) ? undefined : finalPP,
  };
}

export function getTotalPpFromSortedPps(ppArray: Array<any>, startIdx = 0) {
  return ppArray.reduce(
    (cum, pp, idx) => cum + Math.pow(WEIGHT_COEFFICIENT, idx + startIdx) * pp,
    0,
  );
}

function calcRawPpAtIdx(
  bottomScores: Array<any>,
  idx: number,
  expected: number,
) {
  const oldBottomPp = getTotalPpFromSortedPps(bottomScores, idx);
  const newBottomPp = getTotalPpFromSortedPps(bottomScores, idx + 1);

  // 0.965^idx * rawPpToFind = expected + oldBottomPp - newBottomPp;
  // rawPpToFind = (expected + oldBottomPp - newBottomPp) / 0.965^idx;
  return (
    (expected + oldBottomPp - newBottomPp) / Math.pow(WEIGHT_COEFFICIENT, idx)
  );
}

/**
 * Gets the amount of raw pp needed to gain the expected pp
 *
 * @param playerId the player id
 * @param expectedPp the expected pp
 * @returns the pp boundary (+ per raw pp)
 */
export function calcPpBoundary(playerId: string, expectedPp = 1) {
  const rankedScores = usePlayerScoresStore
    .getState()
    .players.find((p) => p.id === playerId)
    ?.scores?.scoresaber.filter((s) => s.score.pp !== undefined);
  if (!rankedScores) return null;

  const rankedScorePps = rankedScores
    .map((s) => s.score.pp)
    .sort((a, b) => b - a);

  let idx = rankedScorePps.length - 1;

  while (idx >= 0) {
    const bottomSlice = rankedScorePps.slice(idx);
    const bottomPp = getTotalPpFromSortedPps(bottomSlice, idx);

    bottomSlice.unshift(rankedScorePps[idx]);
    const modifiedBottomPp = getTotalPpFromSortedPps(bottomSlice, idx);
    const diff = modifiedBottomPp - bottomPp;

    if (diff > expectedPp) {
      const ppBoundary = calcRawPpAtIdx(
        rankedScorePps.slice(idx + 1),
        idx + 1,
        expectedPp,
      );
      return ppBoundary;
    }

    idx--;
  }
  return calcRawPpAtIdx(rankedScorePps, 0, expectedPp);
}

/**
 * Get the highest pp play of a player
 *
 * @param playerId the player id
 * @returns the highest pp play
 */
export function getHighestPpPlay(playerId: string) {
  const rankedScores = usePlayerScoresStore
    .getState()
    .players.find((p) => p.id === playerId)
    ?.scores?.scoresaber.filter((s) => s.score.pp !== undefined);
  if (!rankedScores) return null;

  const rankedScorePps = rankedScores
    .map((s) => s.score.pp)
    .sort((a, b) => b - a);

  return rankedScorePps[0];
}

/**
 * Gets the average pp of the player
 *
 * @param playerId the player id
 * @param limit the amount of top scores to average (default: 20)
 */
export function getAveragePp(playerId: string, limit: number = 20) {
  const rankedScores = usePlayerScoresStore
    .getState()
    .players.find((p) => p.id === playerId)
    ?.scores?.scoresaber.filter((s) => s.score.pp !== undefined);
  if (!rankedScores) return null;

  const rankedScorePps = rankedScores
    .map((s) => s.score.pp)
    .sort((a, b) => b - a)
    .slice(0, limit);

  return getTotalPpFromSortedPps(rankedScorePps, 0) / limit;
}
