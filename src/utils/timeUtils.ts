import { formatDistanceToNow, parseISO } from "date-fns";

/**
 * Formats a timestamp to a human readable format
 * eg: 1 minute ago, 2 hours ago, 3 days ago
 *
 * @param timestamp the timestamp to format
 * @returns the formatted timestamp
 */
export function formatTimeAgo(timestamp: string) {
  const date = parseISO(timestamp);
  const now = new Date();
  if (date > now) {
    return "just now";
  }

  const timeDifference = formatDistanceToNow(date);
  if (timeDifference === "less than a minute") {
    return "just now";
  } else {
    return `${timeDifference.replace("about", "").replace("almost", "")} ago`;
  }
}

/**
 * Formats a timestamp to a human readable format
 *
 * @param timestamp the timestamp to format
 * @returns the formatted timestamp
 */
export function formatDate(timestamp: string) {
  const date = parseISO(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
