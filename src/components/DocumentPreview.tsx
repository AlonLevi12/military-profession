import type { ModuleContent } from "../types/content";
import type { BuilderModuleProgress } from "../types/progress";
import { Icon } from "./Icon";

interface DocumentPreviewProps {
  module: ModuleContent;
  progress?: BuilderModuleProgress;
  activeSectionId?: string;
  availableSectionIds?: string[];
  onSectionClick?: (sectionId: string) => void;
  readonly?: boolean;
}

export function DocumentPreview({
  module,
  progress,
  activeSectionId,
  availableSectionIds = [],
  onSectionClick,
  readonly = false,
}: DocumentPreviewProps) {
  const completed = new Set(progress?.completedSectionIds ?? []);
  const available = new Set(availableSectionIds);

  return (
    <article className={`document-preview document-preview--${module.id}`}>
      <header className="document-preview__header">
        <span>מסמך עבודה</span>
        <h2>{module.documentName}</h2>
        <small>תרחיש: יום אימון צוותי · מידע בלתי מסווג</small>
      </header>
      <div className="document-preview__body">
        {module.documentSections.map((item) => {
          const isCompleted = completed.has(item.id);
          const isAvailable = readonly || available.has(item.id);
          const isActive = activeSectionId === item.id;
          const selectedTexts = (progress?.selections[item.id] ?? [])
            .map(
              (optionId) =>
                item.options.find((candidate) => candidate.id === optionId)
                  ?.text,
            )
            .filter(Boolean);

          if (readonly) {
            return (
              <section className="document-field is-completed" key={item.id}>
                <div className="document-field__title">
                  <span>{item.order.toString().padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <Icon name="check" />
                </div>
                <p>{selectedTexts.join(" ")}</p>
              </section>
            );
          }

          return (
            <button
              type="button"
              className={[
                "document-field",
                isCompleted ? "is-completed" : "",
                isActive ? "is-active" : "",
                !isAvailable ? "is-locked" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={item.id}
              disabled={!isAvailable}
              onClick={() => onSectionClick?.(item.id)}
              aria-pressed={isActive}
            >
              <span className="document-field__title">
                <span>{item.order.toString().padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                {isCompleted ? (
                  <Icon name="check" />
                ) : !isAvailable ? (
                  <Icon name="lock" />
                ) : (
                  <Icon name="chevron" />
                )}
              </span>
              {isCompleted ? (
                <span className="document-field__content">
                  {selectedTexts.join(" ")}
                </span>
              ) : (
                <span className="document-field__placeholder">
                  {isAvailable
                    ? "לחץ כדי ללמוד ולמלא"
                    : item.lockedHint ?? "יש להשלים תחילה את החלקים הקודמים"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </article>
  );
}
