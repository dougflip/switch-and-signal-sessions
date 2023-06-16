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

    it("filters out Day strings that do not match", () => {
      expect(parseDaysOrDefault(["m", "yyz", ""])).toEqual(["monday"]);
    });

    it("matches mutliple days when they start with the same letter", () => {
      expect(parseDaysOrDefault(["m", "t", "w"])).toEqual([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
      ]);
    });

    it("returns the fallback if all inputs are filtered out", () => {
      expect(parseDaysOrDefault(["yyz"], ["sunday"])).toEqual(["sunday"]);
    });
  });
});
