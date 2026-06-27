import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ModuleHeader } from "../components/ModuleHeader";
import { modules } from "../content/modules";
import { useModuleContent } from "../hooks/useModuleContent";
import { useProgressStore } from "../store/progressStore";

export function ModuleSummaryPage() {
  const module = useModuleContent();
  const builderProgress = useProgressStore((state) =>
    module ? state.builderAnswers[module.id] : undefined,
  );
  const reviewProgress = useProgressStore((state) =>
    module ? state.reviewAnswers[module.id] : undefined,
  );
  const completeModule = useProgressStore((state) => state.completeModule);
  const restartReview = useProgressStore((state) => state.restartReview);

  useEffect(() => {
    if (module && reviewProgress?.result) completeModule(module.id);
  }, [module, reviewProgress?.result, completeModule]);

  if (!module) return <Navigate to="/" replace />;
  const result = reviewProgress?.result;
  if (!result) {
    return <Navigate to={`/module/${module.id}/review`} replace />;
  }

  const nextModule = modules.find(
    (candidate) => candidate.number === module.number + 1,
  );
  const missedBlocks = module.reviewScenarios[0].documentBlocks.filter(
    (block) =>
      result.blocks.find((candidate) => candidate.blockId === block.id)
        ?.missedAnnotations.length,
  );

  return (
    <>
      <ModuleHeader
        module={module}
        step={6}
        description="שלושה עקרונות לקחת למשימה הבאה, ותמונת מצב קצרה של התרגול."
      />
      <div className="summary-page">
        <div className="container">
          <section className="summary-hero">
            <span className="summary-hero__icon">
              <Icon name="flag" />
            </span>
            <div>
              <span className="eyebrow">הנושא הושלם</span>
              <h2>סיימתם את מסלול {module.title}</h2>
              <p>{module.transitionOut}</p>
            </div>
            <div className="summary-stats">
              <div>
                <strong>
                  {builderProgress?.completedSectionIds.length ?? 0}/
                  {module.documentSections.length}
                </strong>
                <span>חלקי מסמך</span>
              </div>
              <div>
                <strong>{result.score.total}%</strong>
                <span>רמת שליטה</span>
              </div>
            </div>
          </section>

          <section className="takeaways" aria-labelledby="takeaways-title">
            <div className="section-heading section-heading--compact">
              <div>
                <span className="eyebrow">לזכור להמשך</span>
                <h2 id="takeaways-title">שלושה עקרונות מרכזיים</h2>
              </div>
            </div>
            <ol>
              {module.summaryPoints.map((point, index) => (
                <li key={point}>
                  <span>0{index + 1}</span>
                  <p>{point}</p>
                </li>
              ))}
            </ol>
          </section>

          {missedBlocks.length > 0 && (
            <section className="review-recommendation">
              <Icon name="spark" />
              <div>
                <span className="eyebrow">מומלץ לחדד</span>
                <h2>נקודות שהוחמצו בתרגיל</h2>
                <ul>
                  {missedBlocks.map((block) => (
                    <li key={block.id}>{block.label}: {block.explanation}</li>
                  ))}
                </ul>
              </div>
              <Link
                className="button button--ghost"
                to={`/module/${module.id}/review`}
                onClick={() => restartReview(module.id)}
              >
                חזרה על התרגיל
              </Link>
            </section>
          )}

          <section className="next-step-card">
            <div>
              <span className="eyebrow">
                {nextModule ? "השלב הבא ברצף" : "סגירת המעגל"}
              </span>
              <h2>
                {nextModule
                  ? `ממשיכים אל ${nextModule.title}`
                  : "חוזרים למפה עם התמונה המלאה"}
              </h2>
              <p>
                {nextModule
                  ? module.transitionOut
                  : "התכנון, ניהול הסיכונים והתחקיר הם רצף אחד שחוזר ומשתפר ממשימה למשימה."}
              </p>
            </div>
            <Link
              className="button button--primary"
              to={nextModule ? `/module/${nextModule.id}/intro` : "/"}
            >
              {nextModule ? `פתיחת ${nextModule.title}` : "חזרה למפת הלמידה"}
              <Icon name="arrow-left" />
            </Link>
          </section>
        </div>
      </div>
      <footer className="sticky-footer sticky-footer--simple">
        <div className="container sticky-footer__inner">
          <Link className="button button--ghost" to="/">
            חזרה למפת הלמידה
          </Link>
          <Link
            className="text-link"
            to={`/module/${module.id}/completed`}
          >
            צפייה חוזרת במסמך
          </Link>
        </div>
      </footer>
    </>
  );
}
