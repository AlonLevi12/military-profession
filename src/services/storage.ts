import { CONTENT_VERSION, STORAGE_KEY } from "../content/config";
import type { UserProgress } from "../types/progress";

export interface StorageService {
  load(): UserProgress | null;
  save(progress: UserProgress): void;
  clear(): void;
}

export function createStorageService(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> | null =
    typeof window === "undefined" ? null : window.localStorage,
): StorageService {
  return {
    load() {
      if (!storage) return null;
      try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as UserProgress;
        if (parsed.contentVersion !== CONTENT_VERSION) return null;
        return parsed;
      } catch {
        return null;
      }
    },
    save(progress) {
      if (!storage) return;
      storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },
    clear() {
      storage?.removeItem(STORAGE_KEY);
    },
  };
}

export const storageService = createStorageService();
