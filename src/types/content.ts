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

export interface ExampleContent {
  title: string;
  caption: string;
  imageSrc: string;
  sourceLabel: string;
}

export interface BuilderContextContent {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ title: string; text: string }>;
  outcome: string;
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
  example: ExampleContent;
  builderContext: BuilderContextContent;
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

export interface RiskSeverityLevel {
  /** Letter grade used as the matrix key and display abbreviation (A/B/C). */
  key: string;
  label: string;
  description?: string;
}

export interface RiskLikelihoodLevel {
  /** Full label, also the matrix key (e.g. "בינונית"). */
  key: string;
  /** Single-letter abbreviation shown in assessment cells (ז/נ/ב/ג). */
  abbr: string;
  description?: string;
}

export interface RiskMatrixConfig {
  severityLevels: RiskSeverityLevel[];
  likelihoodLevels: RiskLikelihoodLevel[];
  /** Lookup of the resulting score: cells[severityKey][likelihoodKey]. */
  cells: Record<string, Record<string, number>>;
  levels: RiskLevel[];
}

export interface ScenarioContent {
  title: string;
  description: string;
  facts: string[];
}
