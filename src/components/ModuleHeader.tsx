import { useState } from "react";
import { Link } from "react-router-dom";
import type { ModuleContent } from "../types/content";
import { ExampleViewer } from "./ExampleViewer";
import { Icon } from "./Icon";
import { ResetDialog } from "./ResetDialog";

interface ModuleHeaderProps {
  module: ModuleContent;
  step: number;
  title: string;
  description?: string;
}

const stepNames = [
  "מבוא",
  "בנייה מודרכת",
  "המסמך השלם",
  "חיפוש טעויות",
  "תוצאות",
  "סיכום",
];

export function ModuleHeader({
  module,
  step,
  title,
  description,
}: ModuleHeaderProps) {
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <>
      <header className="module-header">
        <div className="container">
          <div className="module-header__top">
            <Link className="back-link" to="/">
              <Icon name="arrow-right" />
              מפת הלמידה
            </Link>
            <div className="module-header__meta">
              <span className="module-index">
                נושא {module.number} מתוך 3 · {module.title}
              </span>
              <ExampleViewer module={module} compact />
              <button
                className="reset-topic-button"
                type="button"
                onClick={() => setResetOpen(true)}
              >
                <Icon name="reset" />
                איפוס נושא
              </button>
            </div>
          </div>
          <div className="module-header__title">
            <div>
              <span className="eyebrow">{stepNames[step - 1]}</span>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            <div
              className="progress-ring"
              style={
                { "--progress": `${(step / 6) * 360}deg` } as React.CSSProperties
              }
              aria-label={`שלב ${step} מתוך 6`}
            >
              <span>{step}/6</span>
            </div>
          </div>
          <ol className="stepper" aria-label="התקדמות בנושא">
            {stepNames.map((name, index) => (
              <li
                key={name}
                className={
                  index + 1 === step
                    ? "is-current"
                    : index + 1 < step
                      ? "is-complete"
                      : ""
                }
                aria-current={index + 1 === step ? "step" : undefined}
              >
                <span>
                  {index + 1 < step ? <Icon name="check" /> : index + 1}
                </span>
                <small>{name}</small>
              </li>
            ))}
          </ol>
        </div>
      </header>
      <ResetDialog
        open={resetOpen}
        mode="module"
        moduleId={module.id}
        onClose={() => setResetOpen(false)}
      />
    </>
  );
}
