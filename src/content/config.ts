import type { RiskMatrixConfig, ScoringRules } from "../types/content";

export const CONTENT_VERSION = "2026.06.5";
export const STORAGE_KEY = "military-profession-learning:v1";

export const defaultScoringRules: ScoringRules = {
  foundErrorsWeight: 0.7,
  annotationAccuracyWeight: 0.2,
  avoidFalsePositivesWeight: 0.1,
  recommendedReviewThreshold: 80,
};

// Risk matrix per the official ניהול סיכונים example: severity grades
// (חמור A / בינוני B / קל C) × likelihood (זניחה / נמוכה / בינונית / גבוהה),
// with a fixed lookup of the resulting score (0–10).
export const riskMatrixConfig: RiskMatrixConfig = {
  severityLevels: [
    { key: "A", label: "חמור", description: "פגיעה משמעותית במשימה או באנשים." },
    { key: "B", label: "בינוני", description: "פגיעה ממשית המחייבת מענה." },
    { key: "C", label: "קל", description: "השפעה מוגבלת על רצף הפעילות." },
  ],
  likelihoodLevels: [
    { key: "זניחה", abbr: "ז", description: "לא צפויה בתנאים הרגילים." },
    { key: "נמוכה", abbr: "נ", description: "אפשרית אך אינה סבירה." },
    { key: "בינונית", abbr: "ב", description: "עשויה להתממש בתנאים הקיימים." },
    { key: "גבוהה", abbr: "ג", description: "סביר שתתממש ללא מענה." },
  ],
  cells: {
    A: { זניחה: 3, נמוכה: 7, בינונית: 9, גבוהה: 10 },
    B: { זניחה: 1, נמוכה: 6, בינונית: 8, גבוהה: 9 },
    C: { זניחה: 0, נמוכה: 2, בינונית: 4, גבוהה: 5 },
  },
  levels: [
    { min: 0, max: 4, label: "נמוך", tone: "low" },
    { min: 5, max: 7, label: "בינוני", tone: "medium" },
    { min: 8, max: 10, label: "גבוה", tone: "high" },
  ],
};
