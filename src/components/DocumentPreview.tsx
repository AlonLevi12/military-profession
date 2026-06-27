import type { ReactNode } from "react";
import { riskMatrixConfig } from "../content/config";
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
  /**
   * "builder" – the interactive working view (default).
   * "letter" – the completed document rendered as an official IDF
   * staff document per כללי כתיבה צבאית (frameless A4, letterhead, אל/דע,
   * הנדון, signature).
   */
  variant?: "builder" | "letter";
}

/** Constant letterhead — identical on every official document. */
const letterhead = {
  school: "בית הספר לקצינים ע״ש רא״ל לסקוב",
  branch: "ענף ההדרכה",
  phones: [
    "טלפון מטכ״לי: 03-9876443",
    "טלפון אזרחי: 03-1928376",
    "מספר פקס: 03-1928376",
  ],
};

interface LetterMeta {
  classification: string;
  hebrewDate: string;
  gregorianDate: string;
  to: string;
  cc: string;
  subject: string;
  signOff: string;
  signerName: string;
  signerRole: string;
}

/**
 * Sample (training) values for the official-document framing. Hebrew dates
 * are taken from verified examples; everything here is placeholder content
 * meant to be reviewed by an authorized instructor before deployment.
 */
const letterMetaByModule: Record<ModuleContent["id"], LetterMeta> = {
  paka: {
    classification: "בלמ״ס",
    hebrewDate: "ט׳ בתמוז התשפ״ו",
    gregorianDate: "24 ביוני 2026",
    to: "בה״ד 1 - מגמת נחשון - גדוד ארז - מ״פ גולן - יעל טרבלסי",
    cc: "בה״ד 1 - מגמת נחשון - גדוד ארז - פלוגת גולן - מפקדת צוות 11 - סגן ליה בן אדון",
    subject: "פקודת ארגון – יום אימון צוותי",
    signOff: "בברכה,",
    signerName: "צוער אורי יצחק",
    signerRole: "צוער בבית הספר לקצינים",
  },
  risk: {
    classification: "בלמ״ס",
    hebrewDate: "ג׳ בתמוז התשפ״ו",
    gregorianDate: "18 ביוני 2026",
    to: "בה״ד 1 – מגמת נחשון – גדוד ארז – פלוגת גולן – מפקדי הצוותים",
    cc: "בה״ד 1 – מגמת נחשון – גדוד ארז – מ״פ גולן",
    subject: "ניהול סיכונים – יום אימון צוותי",
    signOff: "בברכה,",
    signerName: "צוער אורי יצחק",
    signerRole: "צוער בבית הספר לקצינים",
  },
  debrief: {
    classification: "בלמ״ס",
    hebrewDate: "ט׳ בתמוז התשפ״ו",
    gregorianDate: "24 ביוני 2026",
    to: "בה״ד 1 - מגמת נחשון - גדוד ארז - מ״פ גולן - יעל טרבלסי",
    cc: "בה״ד 1 - מגמת נחשון - גדוד ארז - פלוגת גולן - מפקדת צוות 11 - סגן ליה בן אדון",
    subject: "תחקיר – יום אימון צוותי",
    signOff: "בברכה,",
    signerName: "צוער אורי יצחק",
    signerRole: "צוער בבית הספר לקצינים",
  },
};

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
  variant = "builder",
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

  const renderBuilderShell = (children: ReactNode) => (
    <article
      className={`document-preview document-preview--${module.id} military-form-card`}
    >
      <div className={`military-form military-form--${module.id}`} dir="rtl">
        <div className="military-form__classification">בלמ״ס</div>
        <header className="military-form__header">
          <img
            className="military-form__logo"
            src="/logos/school-emblem.png"
            alt="סמל בית הספר לקצינים"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
          <div className="military-form__title">
            <span>מסמך תרגול</span>
            <h2>{module.documentName}</h2>
            <p>{formSubtitles[module.id]}</p>
          </div>
          <img
            className="military-form__logo"
            src="/logos/idf-emblem.jpg"
            alt="סמל צה״ל"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
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

  /**
   * Official document framing per כללי כתיבה צבאית — frameless A4 page,
   * classification + page number, letterhead, emblems, date, אל/דע,
   * salutation, הנדון and signature block.
   */
  const renderLetterShell = (children: ReactNode) => {
    const meta = letterMetaByModule[module.id];
    return (
      <article className={`official-document official-document--${module.id}`}>
        <div className="official-page" dir="rtl">
          <div className="official-classification">
            <span className="official-classification__label">
              {meta.classification}
            </span>
            <span className="official-classification__page">1</span>
          </div>

          <header className="official-header">
            <div className="official-emblems">
              <img
                src="/logos/idf-emblem.jpg"
                alt="סמל צה״ל"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <img
                src="/logos/school-emblem.png"
                alt="סמל בית הספר לקצינים"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="official-sender">
              <div className="official-letterhead">
                <strong>{letterhead.school}</strong>
                <span>{letterhead.branch}</span>
                {letterhead.phones.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
              <div className="official-date">
                <span>{meta.hebrewDate}</span>
                <span>{meta.gregorianDate}</span>
              </div>
            </div>
          </header>

          <div className="official-routing">
            <p>
              <span className="official-routing__key official-routing__key--to">
                אל:
              </span>{" "}
              {meta.to}
            </p>
            <p>
              <span className="official-routing__key">דע:</span> {meta.cc}
            </p>
          </div>

          <p className="official-salutation">שלום רב,</p>

          <p className="official-subject">
            <span className="official-subject__key">הנדון:</span>{" "}
            <span className="official-subject__value">{meta.subject}</span>
          </p>

          <div className="official-body">{children}</div>

          <div className="official-signature">
            <span className="official-signature__off">{meta.signOff}</span>
            <span className="official-signature__name">{meta.signerName}</span>
            <span className="official-signature__role">{meta.signerRole}</span>
          </div>
        </div>
      </article>
    );
  };

  const renderShell =
    variant === "letter" ? renderLetterShell : renderBuilderShell;

  /**
   * PKA body exactly as the official example: numbered sections (1.) whose
   * content is rendered as sub-items (א.), with לו״ז עקרוני and תחומי אחריות
   * as the 4- and 3-column tables.
   */
  const renderPakaOfficialBody = () => {
    const sectionText = (sectionId: string) => {
      const section = sectionById.get(sectionId);
      return section ? getSelectedText(section) : "";
    };
    const prose = (num: number, title: string, sectionId: string) => (
      <section className="official-section">
        <h3 className="official-section__title">
          {num}. {title}
        </h3>
        <p className="official-section__item">א. {sectionText(sectionId)}</p>
      </section>
    );

    return (
      <div className="official-sections">
        {prose(1, "כללי", "general")}
        {prose(2, "מטרות", "goals")}
        {prose(3, "שיטה", "method")}
        {prose(4, "רציונאל", "rationale")}

        <section className="official-section">
          <h3 className="official-section__title">5. לו״ז עקרוני</h3>
          <table className="official-table">
            <thead>
              <tr>
                <th>שעות</th>
                <th>תוכן</th>
                <th>גורם מעביר</th>
                <th>הערות</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{sectionText("schedule-hours")}</td>
                <td>{sectionText("schedule")}</td>
                <td>{sectionText("schedule-presenter")}</td>
                <td>{sectionText("schedule-notes")}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="official-section">
          <h3 className="official-section__title">6. תחומי אחריות</h3>
          <table className="official-table">
            <thead>
              <tr>
                <th>גורם אחראי</th>
                <th>תוכן</th>
                <th>הערות</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{sectionText("resp-owner")}</td>
                <td>{sectionText("responsibilities")}</td>
                <td>{sectionText("resp-notes")}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {prose(7, "דגשים", "emphasis")}
      </div>
    );
  };

  if (variant === "letter" && module.id === "paka") {
    return renderShell(renderPakaOfficialBody());
  }

  if (module.id === "risk") {
    // Compact assessment cells for the final document, e.g. "ב A 9" — the
    // likelihood abbreviation, severity grade and matrix value derived from
    // the cadet's selections. The builder keeps the full explanatory fields.
    const textOf = (sectionId: string) => {
      const section = sectionById.get(sectionId);
      return section ? getSelectedText(section) : "";
    };
    const severityGradeFrom = (text: string) => {
      const grade = text.match(/\b[ABC]\b/);
      if (grade) return grade[0];
      if (text.includes("חמור")) return "A";
      if (text.includes("בינוני")) return "B";
      if (text.includes("קל")) return "C";
      return "";
    };
    const likelihoodAbbrFrom = (text: string) =>
      riskMatrixConfig.likelihoodLevels.find((level) =>
        text.includes(level.key),
      )?.abbr ?? "";
    const valueFrom = (text: string) => text.match(/\d+/)?.[0] ?? "";
    const compact = (likelihood: string, severity: string, value: string) =>
      [likelihoodAbbrFrom(likelihood), severityGradeFrom(severity), valueFrom(value)]
        .filter(Boolean)
        .join(" ");

    const residualText = textOf("residual");
    const firstAssessment = compact(
      textOf("likelihood"),
      textOf("severity"),
      textOf("initial-level"),
    );
    const secondAssessment = compact(residualText, residualText, residualText);

    return renderShell(
      <div className="military-form__section">
        <h3 className="risk-table__heading">פרטי האירוע</h3>
        <div className="military-form__table-scroll">
          <table className="military-form__table military-form__table--risk">
            <thead>
              <tr>
                <th>שלב במשימה</th>
                <th>סכנה</th>
                <th>סיכון</th>
                <th>גורם סיכון (M5)</th>
                <th>הערכת סיכון ראשונית</th>
                <th>פעילות מתקנת</th>
                <th>הערכת סיכון שנייה</th>
                <th>אחריות לביצוע</th>
                <th>בקרה ועדכון</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{renderField("stage", { compact: true })}</td>
                <td>{renderField("hazard", { compact: true })}</td>
                <td>{renderField("risk-statement", { compact: true })}</td>
                <td>{renderField("m5", { compact: true })}</td>
                <td>
                  {variant === "letter" ? (
                    <span className="risk-assessment">{firstAssessment}</span>
                  ) : (
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
                  )}
                </td>
                <td>{renderField("mitigation", { compact: true })}</td>
                <td>
                  {variant === "letter" ? (
                    <span className="risk-assessment">{secondAssessment}</span>
                  ) : (
                    renderField("residual", { compact: true })
                  )}
                </td>
                <td>{renderField("owner-deadline", { compact: true })}</td>
                <td>{renderField("monitoring", { compact: true })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>,
    );
  }

  if (module.id === "debrief") {
    const textOf = (sectionId: string) => {
      const section = sectionById.get(sectionId);
      return section ? getSelectedText(section) : "";
    };

    if (variant === "letter") {
      return renderShell(
        <div className="official-sections">
          <section className="official-section">
            <h3 className="official-section__title">1. כללי</h3>
            <div className="debrief-box">
              <p>
                <strong>מועד האירוע:</strong> {textOf("event-date")}
              </p>
              <p>
                <strong>מקום האירוע:</strong> {textOf("event-place")}
              </p>
              <p>
                <strong>תיאור האירוע:</strong> {textOf("general")}
              </p>
              <p>
                <strong>תוצאות האירוע:</strong> {textOf("event-results")}
              </p>
              <p>
                <strong>משתתפים בתחקיר:</strong>
              </p>
              <p className="official-section__item">{textOf("participants")}</p>
            </div>
          </section>
          <section className="official-section">
            <h3 className="official-section__title">2. ממצאים</h3>
            <p className="debrief-sub">א. ממצאי רקע</p>
            <p className="official-section__item">1) {textOf("background")}</p>
            <p className="debrief-sub">ב. רצף כרונולוגי</p>
            <p className="official-section__item">1) {textOf("findings")}</p>
            <p className="debrief-sub">ג. ממצאים נוספים</p>
            <p className="official-section__item">
              1) {textOf("additional-findings")}
            </p>
          </section>
          <section className="official-section">
            <h3 className="official-section__title">3. מסקנות</h3>
            <p className="debrief-sub">א. גורמים</p>
            <p className="official-section__item">1) {textOf("conclusions")}</p>
            <p className="debrief-sub">ב. תקלות ושגיאות</p>
            <p className="official-section__item">1) {textOf("gaps")}</p>
            <p className="debrief-sub">ג. נק׳ ראויות לציון</p>
            <p className="official-section__item">1) {textOf("noteworthy")}</p>
          </section>
          <section className="official-section">
            <h3 className="official-section__title">4. לקחים</h3>
            <p className="official-section__item">א. {textOf("lessons")}</p>
          </section>
          <section className="official-section">
            <h3 className="official-section__title">5. המלצות</h3>
            <p className="official-section__item">
              א. {textOf("recommendations")}
            </p>
          </section>
        </div>,
      );
    }

    return renderShell(
      <div className="military-form__section military-form__section--report">
        <section className="military-form__chapter">
          <h3>1. כללי</h3>
          <div className="debrief-fields">
            {renderField("event-date", { label: "מועד האירוע" })}
            {renderField("event-place", { label: "מקום האירוע" })}
            {renderField("general", { label: "תיאור האירוע" })}
            {renderField("event-results", { label: "תוצאות האירוע" })}
            {renderField("participants", { label: "משתתפים בתחקיר" })}
          </div>
        </section>
        <section className="military-form__chapter">
          <h3>2. ממצאים</h3>
          {renderField("background", { label: "א. ממצאי רקע" })}
          {renderField("findings", { label: "ב. רצף כרונולוגי" })}
          {renderField("additional-findings", { label: "ג. ממצאים נוספים" })}
        </section>
        <section className="military-form__chapter">
          <h3>3. מסקנות</h3>
          {renderField("conclusions", { label: "א. גורמים" })}
          {renderField("gaps", { label: "ב. תקלות ושגיאות" })}
          {renderField("noteworthy", { label: "ג. נק׳ ראויות לציון" })}
        </section>
        <section className="military-form__chapter">
          <h3>4. לקחים</h3>
          {renderField("lessons", { label: "פעולה לשימור / תיקון" })}
        </section>
        <section className="military-form__chapter">
          <h3>5. המלצות</h3>
          {renderField("recommendations", {
            label: "פעולה מחוץ לסמכות המתחקר",
          })}
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
              <th>שעות</th>
              <th>תוכן</th>
              <th>גורם מעביר</th>
              <th>הערות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{renderField("schedule-hours", { compact: true })}</td>
              <td>{renderField("schedule", { compact: true })}</td>
              <td>{renderField("schedule-presenter", { compact: true })}</td>
              <td>{renderField("schedule-notes", { compact: true })}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="military-form__chapter">
        <h3>6. תחומי אחריות</h3>
        <table className="military-form__table">
          <thead>
            <tr>
              <th>גורם אחראי</th>
              <th>תוכן</th>
              <th>הערות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{renderField("resp-owner", { compact: true })}</td>
              <td>{renderField("responsibilities", { compact: true })}</td>
              <td>{renderField("resp-notes", { compact: true })}</td>
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
