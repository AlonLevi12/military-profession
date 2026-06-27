import { describe, expect, it } from "vitest";
import { calculateRisk } from "../utils/risk";

describe("risk matrix", () => {
  it("looks up the configured score and level from severity grade and likelihood", () => {
    expect(calculateRisk("A", "בינונית")).toMatchObject({
      value: 9,
      label: "גבוה",
      tone: "high",
    });
    expect(calculateRisk("A", "זניחה")).toMatchObject({
      value: 3,
      label: "נמוך",
      tone: "low",
    });
    expect(calculateRisk("B", "נמוכה")).toMatchObject({
      value: 6,
      label: "בינוני",
      tone: "medium",
    });
  });
});
