import { useEffect, useId, useRef, useState } from "react";
import type { ModuleContent } from "../types/content";
import { Icon } from "./Icon";

interface ExampleViewerProps {
  module: ModuleContent;
  compact?: boolean;
}

export function ExampleViewer({ module, compact = false }: ExampleViewerProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const captionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        className={`example-trigger ${compact ? "example-trigger--compact" : ""}`}
        type="button"
        onClick={() => setOpen(true)}
      >
        <Icon name="document" />
        דוגמה לצפייה
      </button>

      {open && (
        <div
          className="overlay overlay--center example-overlay"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <section
            className="example-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={captionId}
          >
            <header className="example-modal__header">
              <div>
                <span className="eyebrow">{module.example.sourceLabel}</span>
                <h2 id={titleId}>{module.example.title}</h2>
                <p id={captionId}>{module.example.caption}</p>
              </div>
              <button
                ref={closeButtonRef}
                className="icon-button"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="סגירת הדוגמה"
              >
                ×
              </button>
            </header>
            <div className="example-modal__image-wrap">
              <img src={module.example.imageSrc} alt={module.example.title} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
