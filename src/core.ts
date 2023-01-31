import { parse } from "node-html-parser";

/**
 * Represents the strucure contained within a data attribute within Switch and Signal's form tag.
 */
export type ProductVariationDto = {
  attributes: {
    "attribute_session-time": string;
  };
  max_qty: number;
};

export type SessionInfo = {
  time: string;
  quantity: number;
};

export type DayWithSessions = {
  kind: "day-with-sessions";
  day: Day;
  sessions: SessionInfo[];
};

export type DayFailedToLoad = {
  kind: "day-failed-load";
  day: Day;
  reason: string;
};

export type DayResult = DayWithSessions | DayFailedToLoad;

export const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type Day = (typeof days)[number];

/**
 * Fetches the HTML for a given Day instance.
 * Throws for any encountered errors.
 */
async function fetchHtml(day: Day): Promise<string> {
  const url = `https://switchandsignalskatepark.com/product/${day}-open-skate-sessions/`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    return await response.text();
  } catch (e) {
    throw new Error(
      `Unable to download the HTML for ${day}. Check that this URL is correct: ${url}`
    );
  }
}

/**
 * Attempts to parse a `ProductVariationDto[]` from a raw string of HTML.
 * The needed data is encoded within a data attribute of a form tag.
 * Throws for any encountered errors.
 */
function parseProducts(htmlText: string): ProductVariationDto[] {
  try {
    const root = parse(htmlText);
    const productVariationsString = root
      .querySelector("form.variations_form")
      ?.getAttribute("data-product_variations");
    // TODO: This should be a call to Zod (or similar)
    return JSON.parse(productVariationsString || "");
  } catch (e) {
    throw new Error(
      `Unable to parse out the products from the HTML. Maybe a CSS class name has changed?`
    );
  }
}

function getSession(product: ProductVariationDto): SessionInfo {
  return {
    time: product.attributes["attribute_session-time"],
    quantity: product.max_qty,
  };
}

export async function getSessions(day: Day): Promise<SessionInfo[]> {
  const html = await fetchHtml(day);
  return parseProducts(html).map(getSession);
}

/**
 * Fetches the sessions for each requested day and returns them as `DayResult[]`.
 * Each entry, `DayResult`, can either be a success or a failure.
 */
export async function getMultiSessions(
  days: readonly Day[]
): Promise<DayResult[]> {
  const daysHtml = await Promise.allSettled(days.map(getSessions));
  return daysHtml.map(
    (x, i): DayResult =>
      x.status === "fulfilled"
        ? { kind: "day-with-sessions", day: days[i], sessions: x.value }
        : { kind: "day-failed-load", day: days[i], reason: x.reason.toString() }
  );
}
