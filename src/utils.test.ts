import { describe, expect, it } from "vitest";

import { parseDaysOrDefault } from "./utils";

describe("utils", () => {
  describe("parseDaysOrDefault", () => {
    it("parses full Day strings to Day instances", () => {
      expect(parseDaysOrDefault(["monday", "tuesday", "friday"])).toEqual([
        "monday",
        "tuesday",
        "friday",
      ]);
    });

    it("parses partial Day strings to Day instances", () => {
      expect(parseDaysOrDefault(["m", "tu", "f"])).toEqual([
        "monday",
        "tuesday",
        "friday",
      ]);
    });

    it("filters out Day strings that do not match or are ambiguous", () => {
      expect(parseDaysOrDefault(["m", "t", "yyz", ""])).toEqual(["monday"]);
    });

    it("returns the fallback if all inputs are filtered out", () => {
      expect(parseDaysOrDefault(["yyz"], ["sunday"])).toEqual(["sunday"]);
    });
  });
});
