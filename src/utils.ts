import { Day, days } from "./core";

/**
 * Converts an input string to `Day[]` using case insensitive startsWith.
 * This means "t" returns ["tuesday", "thursday"] and s returns ["sunday", "saturday"].
 */
function parseDay(maybeDay: string): Day[] {
  if (!maybeDay) {
    return [];
  }

  const lowerDay = maybeDay.toLowerCase();
  return days.filter((x) => x.startsWith(lowerDay));
}

/**
 * Compares 2 day instances so they can be sorted.
 */
function compareDay(a: Day, b: Day): number {
  return days.indexOf(a) - days.indexOf(b);
}

/**
 * Parses a string array to a unique array of Day instances.
 * This uses case insensitive 'startsWith'.
 * Entries that do not match are ignored.
 *
 * ```
 * ['m', 't', 'wednesday', 'th', 's'] // => ['monday', 'wednesday', 'thursday']
 * ```
 */
export function parseDays(rawDays: string[]): Day[] {
  return [...new Set(rawDays.flatMap(parseDay))]
    .filter((x): x is Day => !!x)
    .sort(compareDay);
}

/**
 * Parses the input via `parseDays`.
 * If the parsed result has items then it is returned.
 * If the parsed result is empty then the fallback is returned.
 */
export function parseDaysOrDefault(
  rawDays: string[],
  fallback: readonly Day[] = days
): readonly Day[] {
  const parsed = parseDays(rawDays);
  return parsed.length > 0 ? parsed : fallback;
}
