import { describe, expect, it } from "vitest";
import { modules } from "../content/modules";
import { sectionLessonsByModule } from "../content/sectionLessons";

const normalizeText = (text: string) =>
  text.replace(/\s+/g, " ").replace(/־/g, "-").trim();

const currentScenarioMarkers = [
  "15.7",
  "07:30",
  "07:45",
  "08:00",
  "10:00",
  "10:15",
  "15:30",
  "24 צוערים",
  "שלושה צוותים",
  "יום אימון צוותי",
  "מתחם ההכשרות",
  "תחנה ב׳",
  "תחנות אימון",
  "רכב תובלה",
  "כשירות הרכב",
  "רכב שלא",
  "אישור כשירות",
  "אחראי לוגיסטיקה",
  "ציוד לכל תחנה",
  "בדיקת ציוד תחנות",
  "חוסר בפריט ציוד",
];

describe("section learning material", () => {
  it("provides professional learning material for every builder section", () => {
    for (const module of modules) {
      for (const section of module.documentSections) {
        const lesson = sectionLessonsByModule[module.id][section.id];

        expect(lesson, `${module.id}:${section.id}`).toBeDefined();
        expect(lesson.title.length).toBeGreaterThan(6);
        expect(lesson.principle.length).toBeGreaterThan(40);
        expect(lesson.bullets.length).toBeGreaterThanOrEqual(3);
        expect(lesson.checkQuestions.length).toBeGreaterThanOrEqual(3);
        expect(lesson.example.length).toBeGreaterThan(20);
      }
    }
  });

  it("keeps teaching examples separate from the quiz scenario and answers", () => {
    for (const module of modules) {
      for (const section of module.documentSections) {
        const lesson = sectionLessonsByModule[module.id][section.id];
        const example = normalizeText(lesson.example);
        const correctOptions = section.options.filter((option) =>
          section.correctOptionIds.includes(option.id),
        );

        for (const option of correctOptions) {
          const correctAnswer = normalizeText(option.text);

          expect(
            example,
            `${module.id}:${section.id} example repeats the correct answer`,
          ).not.toBe(correctAnswer);
          expect(
            example.includes(correctAnswer) || correctAnswer.includes(example),
            `${module.id}:${section.id} example overlaps the correct answer`,
          ).toBe(false);
        }

        for (const marker of currentScenarioMarkers) {
          expect(
            example.includes(normalizeText(marker)),
            `${module.id}:${section.id} example leaks marker "${marker}"`,
          ).toBe(false);
        }
      }
    }
  });
});
