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

describe("builder scenario context", () => {
  it("provides enough guided context before the builder questions", () => {
    for (const module of Object.values(modulesById)) {
      expect(
        module.builderContext.title.length,
        `${module.id} builder context title`,
      ).toBeGreaterThan(10);
      expect(
        module.builderContext.description.length,
        `${module.id} builder context description`,
      ).toBeGreaterThan(80);
      expect(
        module.builderContext.items.length,
        `${module.id} builder context items`,
      ).toBeGreaterThanOrEqual(4);
      expect(
        module.builderContext.outcome.length,
        `${module.id} builder context outcome`,
      ).toBeGreaterThan(60);

      for (const item of module.builderContext.items) {
        expect(
          item.title.length,
          `${module.id} context item title`,
        ).toBeGreaterThan(4);
        expect(
          item.text.length,
          `${module.id} context item text`,
        ).toBeGreaterThan(60);
      }
    }
  });
});
