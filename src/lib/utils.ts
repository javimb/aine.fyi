import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MINOR_WORDS = new Set([
  "de",
  "del",
  "en",
  "con",
  "para",
  "por",
  "e",
  "y",
]);

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index === 0 || !MINOR_WORDS.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}
