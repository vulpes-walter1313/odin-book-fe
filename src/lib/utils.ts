import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortTimeAgo(date: Date): string {
  const result = formatDistanceToNowStrict(date);
  return result
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" weeks", "w")
    .replace(" week", "w")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y");
}

function padSingleNum(num: number): string {
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
}
export function formatDateForDateTimeLocalInput(date: Date) {
  const displayMonth = padSingleNum(date.getMonth() + 1);
  const displayDay = padSingleNum(date.getDate());
  const displayHours = padSingleNum(date.getHours());
  const displayMinutes = padSingleNum(date.getMinutes());

  return `${date.getFullYear()}-${displayMonth}-${displayDay}T${displayHours}:${displayMinutes}`;
}
