import { describe, expect, it } from "vitest";
import { calculateRisk } from "../utils/risk";

describe("risk matrix", () => {
  it("calculates the configured level from severity and likelihood", () => {
    expect(calculateRisk(4, 3)).toMatchObject({
      value: 12,
      label: "גבוה",
      tone: "high",
    });
    expect(calculateRisk(4, 1)).toMatchObject({
      value: 4,
      label: "נמוך",
      tone: "low",
    });
  });
});
