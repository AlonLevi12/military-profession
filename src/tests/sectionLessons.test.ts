import { describe, expect, it } from "vitest";
import { modules } from "../content/modules";
import { sectionLessonsByModule } from "../content/sectionLessons";

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
});
