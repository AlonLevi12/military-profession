import { Link } from "react-router-dom";
import { modules } from "../content/modules";
import { sharedScenario } from "../content/scenario";
import { useProgressStore } from "../store/progressStore";
import type { ModuleStatus } from "../types/content";
import { Icon } from "../components/Icon";

const statusLabels: Record<ModuleStatus, string> = {
  notStarted: "לא התחיל",
  inProgress: "בתהליך",
  completed: "הושלם",
  recommendedReview: "הושלם · מומלץ לחזור",
};

const moduleIcons = {
  paka: "document",
  risk: "shield",
  debrief: "search",
} as const;

export function RoadmapPage() {
  const statuses = useProgressStore((state) => state.moduleStatuses);

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">
              בה״ד 1 · מסלול למידה עצמי
            </span>
            <h1>
              מתכנון פיקודי,
              <br />
              דרך ניהול סיכון,
              <br />
              <span>ועד למידה מן הביצוע.</span>
            </h1>
            <p>
              סביבת תרגול נקייה ברוח בה״ד 1: שלושה כלי עבודה פיקודיים,
              תרחיש הכשרה אחד, ובכל שלב מעבר מדויק בין פקודה, בקרה
              ולמידה.
            </p>
            <div className="hero__identity" aria-label="עקרונות בה״ד 1">
              <span>קצונה</span>
              <span>אחריות</span>
              <span>בקרה</span>
            </div>
            <div className="hero__actions">
              <Link className="button button--light" to="/module/paka/intro">
                התחלת המסלול
                <Icon name="arrow-left" />
              </Link>
              <a className="text-link text-link--light" href="#roadmap">
                צפייה במפת הלמידה
              </a>
            </div>
          </div>
          <aside className="scenario-card" aria-labelledby="scenario-title">
            <span className="scenario-card__badge">
              <Icon name="flag" />
              תרחיש הכשרה בה״ד 1
            </span>
            <h2 id="scenario-title">{sharedScenario.title}</h2>
            <p>{sharedScenario.description}</p>
            <ul>
              {sharedScenario.facts.slice(0, 4).map((fact) => (
                <li key={fact}>
                  <Icon name="check" />
                  {fact}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">מפת הלמידה</span>
              <h2>רצף הכשרה פיקודי אחד, שלושה כלים</h2>
            </div>
            <p>
              כל נושא בנוי כמו תחנת לימוד בהכשרת קצינים: קצר, ממוסגר
              ומחובר למסמך עבודה אמיתי.
            </p>
          </div>

          <ol className="roadmap">
            {modules.map((module, index) => {
              const status = statuses[module.id];
              const completed =
                status === "completed" || status === "recommendedReview";
              return (
                <li className="roadmap__item" key={module.id}>
                  <Link
                    className={`module-card module-card--${module.id}`}
                    to={`/module/${module.id}/intro`}
                  >
                    <span className="module-card__number">
                      {completed ? <Icon name="check" /> : `0${module.number}`}
                    </span>
                    <span className="module-card__icon">
                      <Icon name={moduleIcons[module.id]} />
                    </span>
                    <span className="module-card__eyebrow">{module.eyebrow}</span>
                    <h3>{module.title}</h3>
                    <p>{module.shortDescription}</p>
                    <span className={`status-chip status-chip--${status}`}>
                      {statusLabels[status]}
                    </span>
                    <span className="module-card__cta">
                      {status === "notStarted" ? "פתיחת הנושא" : "המשך למידה"}
                      <Icon name="arrow-left" />
                    </span>
                  </Link>
                  {index < modules.length - 1 && (
                    <div
                      className={`transition-card ${
                        completed ? "is-highlighted" : ""
                      }`}
                    >
                      <span className="transition-card__line" />
                      <div>
                        <span>
                          {index === 0
                            ? "למה נדרש ניהול סיכונים?"
                            : "למה נדרש תחקיר?"}
                        </span>
                        <p>{module.transitionOut}</p>
                      </div>
                      <Icon name="arrow-left" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="principles-section">
        <div className="container principles-grid">
          <div>
            <Icon name="document" />
            <h3>לומדים דרך מסמך פיקודי</h3>
            <p>כל חלק לחיץ, מוסבר ומנוסח כמו תוצר עבודה ביחידה.</p>
          </div>
          <div>
            <Icon name="spark" />
            <h3>שומרים על שפה צבאית</h3>
            <p>המשוב מחזיר למטרה, אחריות, לו״ז ובקרה — לא רק “נכון/לא נכון”.</p>
          </div>
          <div>
            <Icon name="target" />
            <h3>מתרגלים בקרת מפקד</h3>
            <p>מאתרים טעויות במסמך מלא ומתרגלים תמונת שליטה ממוקדת.</p>
          </div>
        </div>
      </section>
    </>
  );
}
