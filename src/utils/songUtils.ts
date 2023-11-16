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

export function accuracyToColor(acc: number) {
  if (acc >= 90) {
    return "rgb(0, 255, 255)";
  } else if (acc >= 80) {
    return "rgb(255, 255, 255)";
  } else if (acc >= 70) {
    return "rgb(0, 255, 0)";
  } else if (acc >= 60) {
    return "rgb(255, 235, 4)";
  } else {
    return "rgb(255, 0, 0)";
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

/**
 * Turns a song name and author into a YouTube link
 *
 * @param name the name of the song
 * @param songSubName the sub name of the song
 * @param author the author of the song
 * @returns the YouTube link for the song
 */
export function songNameToYouTubeLink(
  name: string,
  songSubName: string,
  author: string,
) {
  const baseUrl = "https://www.youtube.com/results?search_query=";
  let query = "";
  if (name) {
    query += `${name} `;
  }
  if (songSubName) {
    query += `${songSubName} `;
  }
  if (author) {
    query += `${author} `;
  }
  return encodeURI(baseUrl + query.trim().replaceAll(" ", "+"));
}
