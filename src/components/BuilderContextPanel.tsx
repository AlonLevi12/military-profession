import { useId } from "react";
import type { BuilderContextContent } from "../types/content";
import { Icon } from "./Icon";

interface BuilderContextPanelProps {
  context: BuilderContextContent;
}

export function BuilderContextPanel({ context }: BuilderContextPanelProps) {
  const headingId = useId();

  return (
    <section
      className="builder-context-section"
      aria-labelledby={headingId}
    >
      <div className="container">
        <article className="builder-context-card">
          <div className="builder-context-card__header">
            <span className="builder-context-card__badge">
              <Icon name="book" />
              {context.eyebrow}
            </span>
            <div>
              <h2 id={headingId}>{context.title}</h2>
              <p>{context.description}</p>
            </div>
          </div>

          <div className="builder-context-card__body">
            {context.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="builder-context-card__outcome">
            <Icon name="warning" />
            <span>{context.outcome}</span>
          </p>
        </article>
      </div>
    </section>
  );
}
