import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ModuleHeader } from "../components/ModuleHeader";
import { useModuleContent } from "../hooks/useModuleContent";
import { useProgressStore } from "../store/progressStore";

const introCards = [
  ["מהו המסמך?", "what", "document"],
  ["למה צריך אותו?", "why", "target"],
  ["מתי משתמשים בו?", "when", "flag"],
  ["מי נדרש להכיר או להכין?", "who", "book"],
  ["מה הוא מונע או מאפשר?", "enables", "shield"],
] as const;

export function ModuleIntroPage() {
  const module = useModuleContent();
  const startModule = useProgressStore((state) => state.startModule);

  useEffect(() => {
    if (module) startModule(module.id);
  }, [module, startModule]);

  if (!module) return <Navigate to="/" replace />;

  return (
    <>
      <ModuleHeader
        module={module}
        step={1}
        description={module.shortDescription}
      />
      <div className="page-section">
        <div className="container intro-layout">
          <section className="intro-main">
            <div className="intro-lead">
              <span className={`topic-symbol topic-symbol--${module.id}`}>
                <Icon
                  name={
                    module.id === "paka"
                      ? "document"
                      : module.id === "risk"
                        ? "shield"
                        : "search"
                  }
                />
              </span>
              <div>
                <span className="eyebrow">{module.eyebrow}</span>
                <h2>{module.intro.what}</h2>
              </div>
            </div>

            <div className="intro-card-grid">
              {introCards.slice(1).map(([title, field, icon]) => (
                <article className="info-card" key={field} tabIndex={0}>
                  <Icon name={icon} />
                  <h3>{title}</h3>
                  <span className="info-card__hint">פירוט בריחוף</span>
                  <p>{module.intro[field]}</p>
                </article>
              ))}
            </div>

            {module.intro.highlights && (
              <section className="concepts" aria-labelledby="concepts-title">
                <div className="section-heading section-heading--compact">
                  <div>
                    <span className="eyebrow">הבחנות חשובות</span>
                    <h2 id="concepts-title">מושגים שכדאי להפריד ביניהם</h2>
                  </div>
                </div>
                <dl>
                  {module.intro.highlights.map((item) => (
                    <div key={item.term}>
                      <dt>{item.term}</dt>
                      <dd>{item.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </section>

          <aside className="intro-sidebar">
            <div className="connection-card">
              <span className="eyebrow">המקום ברצף</span>
              <h3>איך הנושא מתחבר?</h3>
              <p>{module.intro.connection}</p>
              <div className="mini-flow" aria-hidden="true">
                <span className={module.id === "paka" ? "is-current" : ""}>
                  פק״א
                </span>
                <Icon name="arrow-right" />
                <span className={module.id === "risk" ? "is-current" : ""}>
                  סיכונים
                </span>
                <Icon name="arrow-right" />
                <span className={module.id === "debrief" ? "is-current" : ""}>
                  תחקיר
                </span>
              </div>
            </div>
            <div className="callout">
              <Icon name="book" />
              <div>
                <strong>איך נלמד?</strong>
                <p>
                  נכיר כל חלק במסמך, נשלים אותו מתוך בנק אפשרויות ואז
                  נבקר מסמך אחר ונאתר בו טעויות.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <footer className="sticky-footer">
        <div className="container sticky-footer__inner">
          <Link className="button button--ghost" to="/">
            חזרה למפה
          </Link>
          <Link
            className="button button--primary"
            to={`/module/${module.id}/builder`}
          >
            התחלת הלמידה של מבנה המסמך
            <Icon name="arrow-left" />
          </Link>
        </div>
      </footer>
    </>
  );
}
