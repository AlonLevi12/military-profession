import { useEffect, useRef } from "react";
import type { ModuleId } from "../types/content";
import { useProgressStore } from "../store/progressStore";
import { Icon } from "./Icon";

interface ResetDialogProps {
  open: boolean;
  mode: "all" | "module";
  moduleId?: ModuleId;
  onClose: () => void;
}

export function ResetDialog({
  open,
  mode,
  moduleId,
  onClose,
}: ResetDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const resetAll = useProgressStore((state) => state.resetAll);
  const resetModule = useProgressStore((state) => state.resetModule);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleReset = () => {
    if (mode === "all") resetAll();
    else if (moduleId) resetModule(moduleId);
    onClose();
  };

  return (
    <div className="overlay overlay--center" role="presentation">
      <section
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        aria-describedby="reset-description"
      >
        <span className="dialog__icon">
          <Icon name="warning" />
        </span>
        <h2 id="reset-title">
          {mode === "all" ? "לאפס את כל ההתקדמות?" : "לאפס את הנושא?"}
        </h2>
        <p id="reset-description">
          {mode === "all"
            ? "כל התשובות, התוצאות והסטטוסים יימחקו מהמכשיר הזה."
            : "הבנייה ותרגיל הבקרה בנושא זה יתחילו מחדש."}
        </p>
        <div className="dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="button button--ghost"
            onClick={onClose}
          >
            ביטול
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={handleReset}
          >
            כן, איפוס
          </button>
        </div>
      </section>
    </div>
  );
}
