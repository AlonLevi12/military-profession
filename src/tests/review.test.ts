import { describe, expect, it } from "vitest";
import { modulesById } from "../content/modules";
import { CLEAN_ANNOTATION_ID, scoreReview } from "../utils/review";

describe("review scoring", () => {
  const scenario = modulesById.paka.reviewScenarios[0];

  it("awards a perfect score for exact annotations and clean blocks", () => {
    const answers = Object.fromEntries(
      scenario.documentBlocks.map((block) => [
        block.id,
        block.expectedAnnotations.length
          ? block.expectedAnnotations
          : [CLEAN_ANNOTATION_ID],
      ]),
    );
    const result = scoreReview(
      scenario.documentBlocks,
      answers,
      scenario.scoringRules,
      scenario.id,
    );

    expect(result.score.total).toBe(100);
    expect(result.score.falsePositives).toBe(0);
    expect(result.score.missedAnnotations).toBe(0);
  });

  it("separates missed annotations and false positives", () => {
    const erroneousBlock = scenario.documentBlocks.find(
      (block) => block.expectedAnnotations.length > 0,
    )!;
    const cleanBlock = scenario.documentBlocks.find(
      (block) => block.expectedAnnotations.length === 0,
    )!;
    const answers = {
      [erroneousBlock.id]: [CLEAN_ANNOTATION_ID],
      [cleanBlock.id]: [scenario.annotationBank[0].id],
    };
    const result = scoreReview(
      scenario.documentBlocks,
      answers,
      scenario.scoringRules,
    );

    expect(result.score.missedAnnotations).toBeGreaterThan(0);
    expect(result.score.falsePositives).toBe(1);
    expect(result.score.total).toBeLessThan(100);
  });
});
