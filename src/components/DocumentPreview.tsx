import type { ReactNode } from "react";
import type { DocumentSection, ModuleContent } from "../types/content";
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

interface FieldOptions {
  label?: string;
  placeholder?: string;
  compact?: boolean;
  className?: string;
}

const formSubtitles: Record<ModuleContent["id"], string> = {
  paka: "יום אימון צוותי · פקודת ארגון לביצוע",
  risk: "יום אימון צוותי · טבלת ניהול סיכונים",
  debrief: "יום אימון צוותי · דוח תחקיר מסכם",
};

const metadataByModule: Record<
  ModuleContent["id"],
  Array<{ term: string; value: string }>
> = {
  paka: [
    { term: "מסווג", value: "בלמ״ס" },
    { term: "מועד", value: "15.7 · 07:30–15:30" },
    { term: "מקום", value: "מתחם ההכשרות" },
    { term: "משתתפים", value: "24 צוערים · 3 צוותים" },
  ],
  risk: [
    { term: "משימה", value: "יום אימון צוותי" },
    { term: "שלב", value: "תכנון מקדים" },
    { term: "אישור", value: "מפקד הפעילות" },
    { term: "סטטוס", value: "לעדכון לפני יציאה" },
  ],
  debrief: [
    { term: "אירוע", value: "יום אימון צוותי" },
    { term: "מועד האירוע", value: "15.7" },
    { term: "מוקד", value: "עיכוב תחנה ב׳ וחוסר ציוד" },
    { term: "מתחקר", value: "מפקד הפעילות" },
  ],
};

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
  const sectionById = new Map(
    module.documentSections.map((section) => [section.id, section]),
  );

  const getSelectedText = (section: DocumentSection) =>
    (progress?.selections[section.id] ?? [])
      .map(
        (optionId) =>
          section.options.find((candidate) => candidate.id === optionId)?.text,
      )
      .filter(Boolean)
      .join(" ");

  const renderField = (
    sectionId: string,
    { label, placeholder, compact = false, className = "" }: FieldOptions = {},
  ) => {
    const section = sectionById.get(sectionId);
    if (!section) return null;

    const selectedText = getSelectedText(section);
    const isCompleted = completed.has(section.id) || selectedText.length > 0;
    const isAvailable = readonly || available.has(section.id);
    const isActive = activeSectionId === section.id;
    const content =
      selectedText ||
      placeholder ||
      (isAvailable
        ? "לחץ כדי ללמוד ולמלא את השדה"
        : section.lockedHint ?? "יש להשלים תחילה את החלקים הקודמים");
    const classes = [
      "form-field",
      compact ? "form-field--compact" : "",
      isCompleted ? "is-completed" : "",
      isActive ? "is-active" : "",
      !isAvailable ? "is-locked" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    const fieldTitle = label ?? section.title;
    const bodyClass = selectedText
      ? "form-field__content"
      : "form-field__placeholder";

    const fieldInner = (
      <>
        <span className="form-field__meta">
          <span>{section.order.toString().padStart(2, "0")}</span>
          <strong>{fieldTitle}</strong>
          {isCompleted ? (
            <Icon name="check" />
          ) : !isAvailable ? (
            <Icon name="lock" />
          ) : (
            <Icon name="chevron" />
          )}
        </span>
        <span className={bodyClass}>{content}</span>
      </>
    );

    if (readonly) {
      return (
        <section className={classes} aria-label={fieldTitle} key={section.id}>
          {fieldInner}
        </section>
      );
    }

    return (
      <button
        type="button"
        className={classes}
        key={section.id}
        disabled={!isAvailable}
        onClick={() => onSectionClick?.(section.id)}
        aria-pressed={isActive}
      >
        {fieldInner}
      </button>
    );
  };

  const renderShell = (children: ReactNode) => (
    <article
      className={`document-preview document-preview--${module.id} military-form-card`}
    >
      <div className={`military-form military-form--${module.id}`} dir="rtl">
        <div className="military-form__classification">בלמ״ס</div>
        <header className="military-form__header">
          <div className="military-form__unit-mark">
            <strong>בה״ד 1</strong>
            <span>מדור הכשרות</span>
          </div>
          <div className="military-form__title">
            <span>מסמך תרגול</span>
            <h2>{module.documentName}</h2>
            <p>{formSubtitles[module.id]}</p>
          </div>
          <div className="military-form__unit-mark">
            <strong>מקצוע צבאי</strong>
            <span>עותק למידה</span>
          </div>
        </header>
        <dl className="military-form__metadata">
          {metadataByModule[module.id].map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        {children}
      </div>
    </article>
  );

  if (module.id === "risk") {
    return renderShell(
      <div className="military-form__section">
        <div className="military-form__table-scroll">
          <table className="military-form__table military-form__table--risk">
            <thead>
              <tr>
                <th>מס׳</th>
                <th>גורם סיכון M5</th>
                <th>סכנה</th>
                <th>סיכון</th>
                <th>הערכה ראשונית</th>
                <th>פעילות מתקנת</th>
                <th>אחראי ומועד</th>
                <th>סיכון שיורי</th>
                <th>בקרה ועדכון</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="military-form__row-number">1</td>
                <td>{renderField("m5", { compact: true })}</td>
                <td>{renderField("hazard", { compact: true })}</td>
                <td>{renderField("risk-statement", { compact: true })}</td>
                <td>
                  <div className="military-form__stack">
                    {renderField("severity", {
                      label: "חומרה",
                      compact: true,
                    })}
                    {renderField("likelihood", {
                      label: "סבירות",
                      compact: true,
                    })}
                    {renderField("initial-level", {
                      label: "רמה ראשונית",
                      compact: true,
                    })}
                  </div>
                </td>
                <td>{renderField("mitigation", { compact: true })}</td>
                <td>{renderField("owner-deadline", { compact: true })}</td>
                <td>{renderField("residual", { compact: true })}</td>
                <td>{renderField("monitoring", { compact: true })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>,
    );
  }

  if (module.id === "debrief") {
    return renderShell(
      <div className="military-form__section military-form__section--report">
        <section className="military-form__chapter">
          <h3>1. כללי</h3>
          {renderField("general", { label: "מסגרת האירוע" })}
        </section>
        <section className="military-form__chapter">
          <h3>2. ממצאים ועיקרי ההתרחשות</h3>
          {renderField("findings", { label: "רצף עובדתי" })}
        </section>
        <section className="military-form__chapter">
          <h3>3. תקלות ושגיאות / הגדרת הפער</h3>
          {renderField("gaps", { label: "פער בין מתוכנן לביצוע" })}
        </section>
        <section className="military-form__chapter">
          <h3>4. מסקנות</h3>
          {renderField("conclusions", { label: "סיבת הפער" })}
        </section>
        <section className="military-form__chapter">
          <h3>5. לקחים</h3>
          {renderField("lessons", { label: "פעולה לשימור / תיקון" })}
        </section>
        <section className="military-form__chapter">
          <h3>6. המלצות</h3>
          {renderField("recommendations", {
            label: "פעולה מחוץ לסמכות המתחקר",
          })}
        </section>
        <section className="military-form__chapter">
          <h3>7. סיכום</h3>
          {renderField("summary", { label: "עיקרי התמונה והיישום" })}
        </section>
      </div>,
    );
  }

  return renderShell(
    <div className="military-form__section">
      <section className="military-form__chapter">
        <h3>1. כללי</h3>
        {renderField("general", { label: "מסגרת הפעילות" })}
      </section>
      <section className="military-form__chapter">
        <h3>2. מטרות</h3>
        {renderField("goals", { label: "תוצאות נדרשות" })}
      </section>
      <section className="military-form__chapter">
        <h3>3. רציונל</h3>
        {renderField("rationale", { label: "הצורך המקצועי" })}
      </section>
      <section className="military-form__chapter">
        <h3>4. שיטה</h3>
        {renderField("method", { label: "אופן הביצוע" })}
      </section>
      <section className="military-form__chapter">
        <h3>5. לו״ז עקרוני</h3>
        <table className="military-form__table">
          <thead>
            <tr>
              <th>שעה / שלב</th>
              <th>פעילות מתוכננת</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>07:30–15:30</td>
              <td>{renderField("schedule", { compact: true })}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="military-form__chapter">
        <h3>6. תחומי אחריות</h3>
        <table className="military-form__table">
          <thead>
            <tr>
              <th>בעל תפקיד</th>
              <th>משימה / תוצר לבקרה</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>לוגיסטיקה / מפקד פעילות</td>
              <td>{renderField("responsibilities", { compact: true })}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="military-form__chapter">
        <h3>7. דגשים</h3>
        {renderField("emphasis", { label: "הוראות חוצות וחריגים" })}
      </section>
    </div>,
  );
}
