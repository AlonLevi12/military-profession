import type { RiskMatrixConfig, ScoringRules } from "../types/content";

export const CONTENT_VERSION = "2026.06.1";
export const STORAGE_KEY = "military-profession-learning:v1";

export const defaultScoringRules: ScoringRules = {
  foundErrorsWeight: 0.7,
  annotationAccuracyWeight: 0.2,
  avoidFalsePositivesWeight: 0.1,
  recommendedReviewThreshold: 80,
};

export const riskMatrixConfig: RiskMatrixConfig = {
  severityLevels: [
    { value: 1, label: "זניחה", description: "השפעה שולית וקלה לטיפול." },
    { value: 2, label: "קלה", description: "פגיעה מוגבלת ברצף הפעילות." },
    { value: 3, label: "בינונית", description: "פגיעה ממשית המחייבת מענה." },
    { value: 4, label: "חמורה", description: "פגיעה משמעותית במשימה או באנשים." },
    { value: 5, label: "קריטית", description: "פגיעה חמורה מאוד או עצירת המשימה." },
  ],
  likelihoodLevels: [
    { value: 1, label: "נדירה", description: "לא צפויה בתנאים הרגילים." },
    { value: 2, label: "נמוכה", description: "אפשרית אך אינה סבירה." },
    { value: 3, label: "בינונית", description: "עשויה להתממש בתנאים הקיימים." },
    { value: 4, label: "גבוהה", description: "סביר שתתממש ללא מענה." },
    { value: 5, label: "כמעט ודאית", description: "צפויה להתממש ללא שינוי." },
  ],
  levels: [
    { min: 1, max: 4, label: "נמוך", tone: "low" },
    { min: 5, max: 9, label: "בינוני", tone: "medium" },
    { min: 10, max: 16, label: "גבוה", tone: "high" },
    { min: 17, max: 25, label: "קריטי", tone: "critical" },
  ],
};
