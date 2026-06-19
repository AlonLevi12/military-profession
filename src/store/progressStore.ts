import { create } from "zustand";
import { CONTENT_VERSION } from "../content/config";
import { modulesById } from "../content/modules";
import { storageService } from "../services/storage";
import type { ModuleId, ModuleStatus } from "../types/content";
import type {
  BuilderModuleProgress,
  ReviewResult,
  UserProgress,
} from "../types/progress";

const now = () => new Date().toISOString();

export function createInitialProgress(): UserProgress {
  return {
    contentVersion: CONTENT_VERSION,
    moduleStatuses: {
      paka: "notStarted",
      risk: "notStarted",
      debrief: "notStarted",
    },
    builderAnswers: {},
    reviewAnswers: {},
    updatedAt: now(),
  };
}

interface ProgressState extends UserProgress {
  startModule: (moduleId: ModuleId) => void;
  recordBuilderAttempt: (
    moduleId: ModuleId,
    sectionId: string,
    selection: string[],
    isCorrect: boolean,
  ) => void;
  setReviewAnswer: (
    moduleId: ModuleId,
    scenarioId: string,
    blockId: string,
    annotations: string[],
  ) => void;
  submitReview: (moduleId: ModuleId, result: ReviewResult) => void;
  restartReview: (moduleId: ModuleId) => void;
  completeModule: (moduleId: ModuleId) => void;
  resetModule: (moduleId: ModuleId) => void;
  resetAll: () => void;
}

const loadedProgress = storageService.load() ?? createInitialProgress();

function persist(state: ProgressState) {
  const progress: UserProgress = {
    contentVersion: state.contentVersion,
    moduleStatuses: state.moduleStatuses,
    builderAnswers: state.builderAnswers,
    reviewAnswers: state.reviewAnswers,
    updatedAt: now(),
  };
  storageService.save(progress);
}

function emptyBuilderProgress(): BuilderModuleProgress {
  return {
    selections: {},
    completedSectionIds: [],
    attempts: {},
  };
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  ...loadedProgress,
  startModule(moduleId) {
    set((state) => ({
      moduleStatuses: {
        ...state.moduleStatuses,
        [moduleId]:
          state.moduleStatuses[moduleId] === "notStarted"
            ? "inProgress"
            : state.moduleStatuses[moduleId],
      },
      updatedAt: now(),
    }));
    persist(get());
  },
  recordBuilderAttempt(moduleId, sectionId, selection, isCorrect) {
    set((state) => {
      const current = state.builderAnswers[moduleId] ?? emptyBuilderProgress();
      const completedSectionIds =
        isCorrect && !current.completedSectionIds.includes(sectionId)
          ? [...current.completedSectionIds, sectionId]
          : current.completedSectionIds;
      return {
        builderAnswers: {
          ...state.builderAnswers,
          [moduleId]: {
            selections: isCorrect
              ? { ...current.selections, [sectionId]: selection }
              : current.selections,
            completedSectionIds,
            attempts: {
              ...current.attempts,
              [sectionId]: (current.attempts[sectionId] ?? 0) + 1,
            },
          },
        },
        updatedAt: now(),
      };
    });
    persist(get());
  },
  setReviewAnswer(moduleId, scenarioId, blockId, annotations) {
    set((state) => {
      const current = state.reviewAnswers[moduleId];
      return {
        reviewAnswers: {
          ...state.reviewAnswers,
          [moduleId]: {
            scenarioId,
            answers: {
              ...(current?.scenarioId === scenarioId ? current.answers : {}),
              [blockId]: annotations,
            },
          },
        },
        updatedAt: now(),
      };
    });
    persist(get());
  },
  submitReview(moduleId, result) {
    set((state) => {
      const current = state.reviewAnswers[moduleId];
      return {
        reviewAnswers: {
          ...state.reviewAnswers,
          [moduleId]: {
            scenarioId: result.scenarioId,
            answers: current?.answers ?? {},
            result,
          },
        },
        updatedAt: now(),
      };
    });
    persist(get());
  },
  restartReview(moduleId) {
    set((state) => {
      const reviewAnswers = { ...state.reviewAnswers };
      delete reviewAnswers[moduleId];
      return {
        reviewAnswers,
        moduleStatuses: {
          ...state.moduleStatuses,
          [moduleId]: "inProgress",
        },
        updatedAt: now(),
      };
    });
    persist(get());
  },
  completeModule(moduleId) {
    const result = get().reviewAnswers[moduleId]?.result;
    const threshold =
      modulesById[moduleId].reviewScenarios[0].scoringRules
        .recommendedReviewThreshold;
    const status: ModuleStatus =
      result && result.score.total < threshold
        ? "recommendedReview"
        : "completed";
    set((state) => ({
      moduleStatuses: { ...state.moduleStatuses, [moduleId]: status },
      updatedAt: now(),
    }));
    persist(get());
  },
  resetModule(moduleId) {
    set((state) => {
      const builderAnswers = { ...state.builderAnswers };
      const reviewAnswers = { ...state.reviewAnswers };
      delete builderAnswers[moduleId];
      delete reviewAnswers[moduleId];
      return {
        moduleStatuses: {
          ...state.moduleStatuses,
          [moduleId]: "notStarted",
        },
        builderAnswers,
        reviewAnswers,
        updatedAt: now(),
      };
    });
    persist(get());
  },
  resetAll() {
    const reset = createInitialProgress();
    set(reset);
    storageService.clear();
    storageService.save(reset);
  },
}));
