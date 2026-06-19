import type {
  DocumentBlock,
  ScoringRules,
} from "../types/content";
import type {
  ReviewBlockResult,
  ReviewResult,
  ReviewScore,
} from "../types/progress";

export const CLEAN_ANNOTATION_ID = "__clean__";

export function scoreReview(
  blocks: DocumentBlock[],
  answers: Record<string, string[]>,
  scoringRules: ScoringRules,
  scenarioId = "scenario",
): ReviewResult {
  let truePositives = 0;
  let falsePositives = 0;
  let missedAnnotations = 0;
  let correctCleanBlocks = 0;
  const erroneousBlocks = blocks.filter(
    (block) => block.expectedAnnotations.length > 0,
  );
  const totalExpectedAnnotations = erroneousBlocks.reduce(
    (total, block) => total + block.expectedAnnotations.length,
    0,
  );

  const blockResults: ReviewBlockResult[] = blocks.map((block) => {
    const rawSelected = answers[block.id] ?? [];
    const selected = rawSelected.filter(
      (annotationId) => annotationId !== CLEAN_ANNOTATION_ID,
    );
    const expected = block.expectedAnnotations;
    const matched = selected.filter((annotationId) =>
      expected.includes(annotationId),
    );
    const falseAnnotations = selected.filter(
      (annotationId) => !expected.includes(annotationId),
    );
    const missed = expected.filter(
      (annotationId) => !selected.includes(annotationId),
    );

    truePositives += matched.length;
    falsePositives += falseAnnotations.length;
    missedAnnotations += missed.length;

    if (expected.length === 0 && selected.length === 0) {
      correctCleanBlocks += 1;
    }

    let state: ReviewBlockResult["state"];
    if (expected.length === 0 && selected.length === 0) state = "clean";
    else if (expected.length > 0 && missed.length === 0 && falseAnnotations.length === 0)
      state = "correct";
    else if (matched.length > 0) state = "partial";
    else if (expected.length > 0) state = "missed";
    else state = "false-positive";

    return {
      blockId: block.id,
      selectedAnnotations: rawSelected,
      correctAnnotations: expected,
      matchedAnnotations: matched,
      falseAnnotations,
      missedAnnotations: missed,
      state,
    };
  });

  const foundErroneousBlocks = blockResults.filter(
    (result) =>
      result.correctAnnotations.length > 0 &&
      result.matchedAnnotations.length > 0,
  ).length;
  const foundErrorsRatio =
    erroneousBlocks.length === 0 ? 1 : foundErroneousBlocks / erroneousBlocks.length;
  const annotationAccuracyRatio =
    totalExpectedAnnotations === 0
      ? 1
      : truePositives / totalExpectedAnnotations;
  const selectedAnnotationCount = Object.values(answers)
    .flat()
    .filter((id) => id !== CLEAN_ANNOTATION_ID).length;
  const falsePositiveAvoidanceRatio =
    selectedAnnotationCount === 0
      ? 1
      : Math.max(0, 1 - falsePositives / selectedAnnotationCount);

  const score: ReviewScore = {
    total: Math.round(
      100 *
        (foundErrorsRatio * scoringRules.foundErrorsWeight +
          annotationAccuracyRatio * scoringRules.annotationAccuracyWeight +
          falsePositiveAvoidanceRatio *
            scoringRules.avoidFalsePositivesWeight),
    ),
    foundErrorsScore: Math.round(foundErrorsRatio * 100),
    annotationAccuracyScore: Math.round(annotationAccuracyRatio * 100),
    falsePositiveAvoidanceScore: Math.round(
      falsePositiveAvoidanceRatio * 100,
    ),
    truePositives,
    falsePositives,
    missedAnnotations,
    correctCleanBlocks,
  };

  return {
    scenarioId,
    submittedAt: new Date().toISOString(),
    score,
    blocks: blockResults,
  };
}
