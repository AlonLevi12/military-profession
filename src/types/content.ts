export type ModuleId = "paka" | "risk" | "debrief";

export type ModuleStatus =
  | "notStarted"
  | "inProgress"
  | "completed"
  | "recommendedReview";

export type SelectionMode = "single" | "multiple";

export interface IntroContent {
  what: string;
  why: string;
  when: string;
  who: string;
  enables: string;
  connection: string;
  highlights?: Array<{ term: string; definition: string }>;
}

export interface ContentOption {
  id: string;
  text: string;
  classification: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  belongsToSectionId?: string;
  numericValue?: number;
}

export interface DocumentSection {
  id: string;
  title: string;
  purpose: string;
  whatBelongs: string;
  commonMistakes: string;
  order: number;
  prerequisiteIds: string[];
  selectionMode: SelectionMode;
  options: ContentOption[];
  correctOptionIds: string[];
  lockedHint?: string;
}

export interface Annotation {
  id: string;
  text: string;
  category: string;
}

export interface DocumentBlock {
  id: string;
  sectionId: string;
  label: string;
  content: string;
  expectedAnnotations: string[];
  explanation: string;
  isCorrect: boolean;
}

export interface ScoringRules {
  foundErrorsWeight: number;
  annotationAccuracyWeight: number;
  avoidFalsePositivesWeight: number;
  recommendedReviewThreshold: number;
}

export interface ReviewScenario {
  id: string;
  title: string;
  instructions: string;
  documentBlocks: DocumentBlock[];
  annotationBank: Annotation[];
  scoringRules: ScoringRules;
}

export interface ModuleContent {
  id: ModuleId;
  number: number;
  title: string;
  shortDescription: string;
  eyebrow: string;
  intro: IntroContent;
  transitionIn: string;
  transitionOut: string;
  documentName: string;
  documentSections: DocumentSection[];
  reviewScenarios: ReviewScenario[];
  summaryPoints: string[];
}

export interface RiskLevel {
  min: number;
  max: number;
  label: string;
  tone: "low" | "medium" | "high" | "critical";
}

export interface RiskMatrixConfig {
  severityLevels: Array<{ value: number; label: string; description: string }>;
  likelihoodLevels: Array<{
    value: number;
    label: string;
    description: string;
  }>;
  levels: RiskLevel[];
}

export interface ScenarioContent {
  title: string;
  description: string;
  facts: string[];
}
