import { describe, expect, it } from "vitest";
import { modulesById } from "../content/modules";
import {
  getAvailableSectionIds,
  validateBuilderSelection,
} from "../utils/builder";

describe("builder prerequisites", () => {
  const sections = modulesById.paka.documentSections;

  it("opens only sections with fulfilled prerequisites", () => {
    expect(getAvailableSectionIds(sections, [])).toEqual(["general"]);
    expect(getAvailableSectionIds(sections, ["general"])).toEqual([
      "general",
      "goals",
      "rationale",
    ]);
    expect(
      getAvailableSectionIds(sections, ["general", "goals", "rationale"]),
    ).toContain("method");
  });

  it("does not open dependent sections too early", () => {
    const available = getAvailableSectionIds(sections, ["general", "goals"]);
    expect(available).not.toContain("method");
    expect(available).not.toContain("schedule");
  });
});

describe("builder answer validation", () => {
  const general = modulesById.paka.documentSections[0];

  it("accepts exactly the configured correct answer", () => {
    expect(
      validateBuilderSelection(general, ["paka-general-correct"]),
    ).toBe(true);
  });

  it("rejects wrong or additional answers", () => {
    expect(
      validateBuilderSelection(general, ["paka-general-method"]),
    ).toBe(false);
    expect(
      validateBuilderSelection(general, [
        "paka-general-correct",
        "paka-general-method",
      ]),
    ).toBe(false);
  });
});
