export function songDifficultyToColor(diff: string) {
  switch (diff.toLowerCase()) {
    case "easy":
      return "#3cb371";
    case "normal":
      return "#59b0f4";
    case "hard":
      return "#FF6347";
    case "expert":
      return "#bf2a42";
    case "expert+":
      return "#8f48db";
    default:
      return "gray";
  }
}

export function scoresaberDifficultyNumberToName(
  diff: number,
  shortened: boolean = false,
) {
  switch (diff) {
    case 1:
      return !shortened ? "Easy" : "E";
    case 3:
      return !shortened ? "Normal" : "N";
    case 5:
      return !shortened ? "Hard" : "H";
    case 7:
      return !shortened ? "Expert" : "Ex";
    case 9:
      return !shortened ? "Expert+" : "Ex+";
    default:
      return "unknown";
  }
}
