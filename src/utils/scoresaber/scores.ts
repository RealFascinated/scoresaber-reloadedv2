// Yoinked from https://github.com/Shurdoof/pp-calculator
// Thank for for this I have no fucking idea what the maths is doing but it works!

import { useScoresaberScoresStore } from "@/store/scoresaberScoresStore";

export const WEIGHT_COEFFICIENT = 0.965;

const starMultiplier = 42.11;
const ppCurve = [
  [1, 5.367394282890631],
  [0.9995, 5.019543595874787],
  [0.999, 4.715470646416203],
  [0.99825, 4.325027383589547],
  [0.9975, 3.996793606763322],
  [0.99625, 3.5526145337555373],
  [0.995, 3.2022017597337955],
  [0.99375, 2.9190155639254955],
  [0.9925, 2.685667856592722],
  [0.99125, 2.4902905794106913],
  [0.99, 2.324506282149922],
  [0.9875, 2.058947159052738],
  [0.985, 1.8563887693647105],
  [0.9825, 1.697536248647543],
  [0.98, 1.5702410055532239],
  [0.9775, 1.4664726399289512],
  [0.975, 1.3807102743105126],
  [0.9725, 1.3090333065057616],
  [0.97, 1.2485807759957321],
  [0.965, 1.1552120359501035],
  [0.96, 1.0871883573850478],
  [0.955, 1.0388633331418984],
  [0.95, 1],
  [0.94, 0.9417362980580238],
  [0.93, 0.9039994071865736],
  [0.92, 0.8728710341448851],
  [0.91, 0.8488375988124467],
  [0.9, 0.825756123560842],
  [0.875, 0.7816934560296046],
  [0.85, 0.7462290664143185],
  [0.825, 0.7150465663454271],
  [0.8, 0.6872268862950283],
  [0.75, 0.6451808210101443],
  [0.7, 0.6125565959114954],
  [0.65, 0.5866010012767576],
  [0.6, 0.18223233667439062],
  [0, 0],
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
/**
 * Gets the amount of raw pp needed to gain the expected pp
 *
 * @param playerId the player id
 * @param expectedPp the expected pp
 * @returns the pp boundary (+ per raw pp)
 */
export function calcPpBoundary(playerId: string, expectedPp = 1) {
  const state = useScoresaberScoresStore.getState();
  const player = state.players.find((p) => p.id === playerId);
  if (!player || !player.scores) return null;

  const rankedScorePps = player.scores
    .filter((s) => s.score.pp !== undefined)
    .map((s) => s.score.pp)
    .sort((a, b) => b - a);

  let left = 0;
  let right = rankedScorePps.length - 1;
  let boundaryIdx = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const bottomSlice = rankedScorePps.slice(mid);
    const bottomPp = getTotalPpFromSortedPps(bottomSlice, mid);

    bottomSlice.unshift(rankedScorePps[mid]);
    const modifiedBottomPp = getTotalPpFromSortedPps(bottomSlice, mid);
    const diff = modifiedBottomPp - bottomPp;

    if (diff > expectedPp) {
      boundaryIdx = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (boundaryIdx === -1) {
    return calcRawPpAtIdx(rankedScorePps, 0, expectedPp);
  } else {
    return calcRawPpAtIdx(
      rankedScorePps.slice(boundaryIdx + 1),
      boundaryIdx + 1,
      expectedPp,
    );
  }
}

/**
 * Get the highest pp play of a player
 *
 * @param playerId the player id
 * @returns the highest pp play
 */
export function getHighestPpPlay(playerId: string) {
  const rankedScores = useScoresaberScoresStore
    .getState()
    .players.find((p) => p.id === playerId)
    ?.scores?.filter((s) => s.score.pp !== undefined);
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
 * @param limit the amount of top scores to average (default: 50)
 */
export function getAveragePp(playerId: string, limit: number = 50) {
  const rankedScores = useScoresaberScoresStore
    .getState()
    .players.find((p) => p.id === playerId)
    ?.scores?.filter((s) => s.score.pp !== undefined);
  if (!rankedScores) return null;

  const rankedScorePps = rankedScores
    .map((s) => s.score.pp)
    .sort((a, b) => b - a)
    .slice(0, limit);

  return (
    rankedScorePps.reduce((cum, pp) => cum + pp, 0) / rankedScorePps.length
  );
}

/**
 * Returns the total amount of scores for the given player
 *
 * @param playerId the player id
 * @returns the total amount of scores
 */
export function getTotalScores(playerId: string) {
  return useScoresaberScoresStore.getState().get(playerId)?.scores?.length;
}
