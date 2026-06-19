import type { DocumentSection } from "../types/content";

export function getAvailableSectionIds(
  sections: DocumentSection[],
  completedSectionIds: string[],
): string[] {
  const completed = new Set(completedSectionIds);
  return sections
    .filter((section) =>
      section.prerequisiteIds.every((prerequisiteId) =>
        completed.has(prerequisiteId),
      ),
    )
    .map((section) => section.id);
}

export function validateBuilderSelection(
  section: DocumentSection,
  selectedOptionIds: string[],
): boolean {
  if (selectedOptionIds.length !== section.correctOptionIds.length) {
    return false;
  }

  const selected = new Set(selectedOptionIds);
  return section.correctOptionIds.every((id) => selected.has(id));
}

export function stableShuffle<T extends { id: string }>(
  values: T[],
  seed: string,
): T[] {
  const hash = [...seed].reduce(
    (total, char) => (total * 31 + char.charCodeAt(0)) >>> 0,
    2166136261,
  );

  return [...values].sort((a, b) => {
    const aValue = [...`${hash}:${a.id}`].reduce(
      (total, char) => (total * 33 + char.charCodeAt(0)) >>> 0,
      5381,
    );
    const bValue = [...`${hash}:${b.id}`].reduce(
      (total, char) => (total * 33 + char.charCodeAt(0)) >>> 0,
      5381,
    );
    return aValue - bValue;
  });
}
