import type { ModuleId, ModuleStatus } from "./content";

export interface BuilderModuleProgress {
  selections: Record<string, string[]>;
  completedSectionIds: string[];
  attempts: Record<string, number>;
}

export interface ReviewScore {
  total: number;
  foundErrorsScore: number;
  annotationAccuracyScore: number;
  falsePositiveAvoidanceScore: number;
  truePositives: number;
  falsePositives: number;
  missedAnnotations: number;
  correctCleanBlocks: number;
}

export interface ReviewBlockResult {
  blockId: string;
  selectedAnnotations: string[];
  correctAnnotations: string[];
  matchedAnnotations: string[];
  falseAnnotations: string[];
  missedAnnotations: string[];
  state: "correct" | "partial" | "false-positive" | "missed" | "clean";
}

export interface ReviewResult {
  scenarioId: string;
  submittedAt: string;
  score: ReviewScore;
  blocks: ReviewBlockResult[];
}

export interface ReviewModuleProgress {
  scenarioId: string;
  answers: Record<string, string[]>;
  result?: ReviewResult;
}

export interface UserProgress {
  contentVersion: string;
  moduleStatuses: Record<ModuleId, ModuleStatus>;
  builderAnswers: Partial<Record<ModuleId, BuilderModuleProgress>>;
  reviewAnswers: Partial<Record<ModuleId, ReviewModuleProgress>>;
  updatedAt: string;
}
