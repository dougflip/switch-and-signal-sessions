import { Day, days } from "./core";

function parseDay(maybeDay: string): Day | null {
  if (!maybeDay) {
    return null;
  }

  const lowerDay = maybeDay.toLowerCase();
  const matches = days.filter((x) => x.startsWith(lowerDay));

  return matches.length === 1 ? matches[0] : null;
}

/**
 * Parses a string array to an array of Day instances.
 * This allows for 'startsWith' style strings as long as we only match a single day.
 * Entries that do not match are filtered out.
 *
 * ```
 * ['m', 't', 'wednesday', 'th', 's'] // => ['monday', 'wednesday', 'thursday']
 * ```
 */
export function parseDays(rawDays: string[]): Day[] {
  return rawDays.map(parseDay).filter((x): x is Day => !!x);
}

/**
 * Parses the input via `parseDays`.
 * If the parsed result has items then it is returned.
 * If the parsed result is empty then the fallback is returned.
 */
export function parseDaysOrDefault(
  rawDays: string[],
  fallback = days
): readonly Day[] {
  const parsed = parseDays(rawDays);
  return parsed.length > 0 ? parsed : days;
}
