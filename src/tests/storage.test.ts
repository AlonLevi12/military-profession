import { describe, expect, it } from "vitest";
import { CONTENT_VERSION, STORAGE_KEY } from "../content/config";
import { createStorageService } from "../services/storage";
import type { UserProgress } from "../types/progress";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const progress: UserProgress = {
  contentVersion: CONTENT_VERSION,
  moduleStatuses: {
    paka: "inProgress",
    risk: "notStarted",
    debrief: "notStarted",
  },
  builderAnswers: {},
  reviewAnswers: {},
  updatedAt: "2026-06-19T00:00:00.000Z",
};

describe("StorageService", () => {
  it("round-trips progress", () => {
    const memory = new MemoryStorage();
    const service = createStorageService(memory);
    service.save(progress);
    expect(service.load()).toEqual(progress);
  });

  it("ignores progress from an incompatible content version", () => {
    const memory = new MemoryStorage();
    memory.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...progress, contentVersion: "old-version" }),
    );
    expect(createStorageService(memory).load()).toBeNull();
  });

  it("clears saved progress", () => {
    const memory = new MemoryStorage();
    const service = createStorageService(memory);
    service.save(progress);
    service.clear();
    expect(service.load()).toBeNull();
  });
});
