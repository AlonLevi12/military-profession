import { useId } from "react";
import { Icon } from "./Icon";

interface StageGuideItem {
  title: string;
  text: string;
}

interface StageGuideProps {
  eyebrow: string;
  title: string;
  description: string;
  items: StageGuideItem[];
  outcome: string;
}

export function StageGuide({
  eyebrow,
  title,
  description,
  items,
  outcome,
}: StageGuideProps) {
  const headingId = useId();

  return (
    <section className="stage-guide-section" aria-labelledby={headingId}>
      <div className="container">
        <article className="stage-guide">
          <div className="stage-guide__intro">
            <span className="eyebrow">{eyebrow}</span>
            <h2 id={headingId}>{title}</h2>
            <p>{description}</p>
          </div>

          <div className="stage-guide__body">
            <ol className="stage-guide__steps">
              {items.map((item, index) => (
                <li key={item.title}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="stage-guide__outcome">
              <Icon name="target" />
              <span>{outcome}</span>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
