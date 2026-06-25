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
              לומדת המקצוע הצבאי · בה״ד 1
            </span>
            <h1>
              לומדים את הכלים,
              <br />
              רואים איך זה נראה,
              <br />
              <span>ומתרגלים כמו בעבודה אמיתית.</span>
            </h1>
            <p>
              לומדה קצרה ונעימה שמסבירה שלושה נושאים מרכזיים במקצוע
              הצבאי: פק״א, ניהול סיכונים ותחקיר. בכל נושא קוראים הסבר
              ממוקד, רואים דוגמה מהחומר, מתרגלים מילוי או בקרה של טופס
              אמיתי, ומקבלים משוב שמסביר את ההיגיון מאחורי כל בחירה.
            </p>
            <div className="hero__actions">
              <a className="button button--light" href="#roadmap">
                קריאת הרקע והתחלת הלמידה
                <Icon name="arrow-left" />
              </a>
              <a className="text-link text-link--light" href="#roadmap">
                צפייה ברצף התרגול
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="container">
          <article className="roadmap-context" aria-labelledby="scenario-title">
            <div className="roadmap-context__intro">
              <span className="roadmap-context__badge">
                <Icon name="flag" />
                תחנה 0 · קריאת רקע
              </span>
              <h2 id="scenario-title">{sharedScenario.title}</h2>
              <p>
                לפני שמתחילים לענות, קוראים את הרקע ושומרים אותו בראש.
                כל הפקודות, טבלאות הסיכונים והתחקירים שתבנו בהמשך נשענים
                על אותו אירוע.
              </p>
            </div>
            <div className="roadmap-context__body">
              <p>{sharedScenario.description}</p>
              <ul>
                {sharedScenario.facts.map((fact) => (
                  <li key={fact}>
                    <Icon name="check" />
                    {fact}
                  </li>
                ))}
              </ul>
              <p className="roadmap-context__instruction">
                אחרי שהרקע ברור, עוברים נושא־נושא לפי הסדר: קודם מתכננים
                בפק״א, אחר כך מנהלים את הסיכונים, ובסוף לומדים מהביצוע
                דרך תחקיר.
              </p>
            </div>
          </article>

          <div className="section-heading">
            <div>
              <span className="eyebrow">מפת הלמידה</span>
              <h2>קוראים את הרקע, ואז מתקדמים כלי־כלי</h2>
            </div>
            <p>
              כל נושא בנוי כתחנת לימוד קצרה: הסבר מקצועי, דוגמה לצפייה,
              תרגול על טופס אמיתי ומשוב שמחזיר לרקע שקראתם.
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
