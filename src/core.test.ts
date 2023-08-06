import { describe, expect, it, vi } from "vitest";

import createFetchMock from "vitest-fetch-mock";
import {
  DayFailedToLoad,
  DayResult,
  DayWithSessions,
  getMultiSessions,
} from "./core";
import { readFileSync } from "fs";

const mockResponse = readFileSync(`${__dirname}/mock-response.html`).toString();

function asDayWithSessionsOrFail(x: DayResult): DayWithSessions {
  if (x.kind === "day-with-sessions") {
    return x;
  }

  throw new Error(`DayResult is not day with sessions`);
}

function asDayFailedLoad(x: DayResult): DayFailedToLoad {
  if (x.kind === "day-failed-load") {
    return x;
  }

  throw new Error(`DayResult is not day failed load`);
}

function setup() {
  const fetchMock = createFetchMock(vi);
  fetchMock.enableMocks();
  return fetchMock;
}

describe("core", () => {
  describe("getMultiSessions", () => {
    describe("success", () => {
      it("fetches a single day", async () => {
        const fetchMock = setup();
        fetchMock.mockResponse(mockResponse);
        const results = await getMultiSessions(["wednesday"]);
        expect(results.length).toBe(1);

        const wednesday = asDayWithSessionsOrFail(results[0]);
        expect(wednesday.sessions.length).toBe(2);
        expect(wednesday.sessions).toMatchInlineSnapshot(`
                  [
                    {
                      "price": 12,
                      "quantity": 20,
                      "time": "2:30-5:00pm",
                    },
                    {
                      "price": 12,
                      "quantity": 20,
                      "time": "7:30-10pm",
                    },
                  ]
                `);
      });
    });

    describe("failure", () => {
      it("fails gracefully when the network fails", async () => {
        const fetchMock = setup();
        fetchMock.mockReject();
        const results = await getMultiSessions(["wednesday"]);
        expect(results.length).toBe(1);
        const wednesday = asDayFailedLoad(results[0]);
        expect(wednesday.reason).toMatchInlineSnapshot(
          '"Error: Unable to download the HTML for wednesday. Check that this URL is correct: https://switchandsignalskatepark.com/product/wednesday-open-skate-sessions/"',
        );
      });

      it("fails gracefully when the hmtl does not properly parse", async () => {
        const fetchMock = setup();
        fetchMock.mockResponse("<html>No form tag to parse</html>");
        const results = await getMultiSessions(["wednesday"]);
        expect(results.length).toBe(1);
        const wednesday = asDayFailedLoad(results[0]);
        expect(wednesday.reason).toMatchInlineSnapshot(
          '"Error: Unable to parse out the products from the HTML. Maybe a CSS class name has changed?"',
        );
      });
    });
  });
});
