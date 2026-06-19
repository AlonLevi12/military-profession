import { Link, Navigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ModuleHeader } from "../components/ModuleHeader";
import { useModuleContent } from "../hooks/useModuleContent";
import { useProgressStore } from "../store/progressStore";
import { CLEAN_ANNOTATION_ID } from "../utils/review";

const stateLabels = {
  correct: "זיהוי מלא",
  partial: "זיהוי חלקי",
  "false-positive": "סימון שגוי",
  missed: "טעות שלא נמצאה",
  clean: "חלק תקין",
};

export function ErrorReviewResultsPage() {
  const module = useModuleContent();
  const reviewProgress = useProgressStore((state) =>
    module ? state.reviewAnswers[module.id] : undefined,
  );

  if (!module) return <Navigate to="/" replace />;
  const scenario = module.reviewScenarios[0];
  const result = reviewProgress?.result;
  if (!result) {
    return <Navigate to={`/module/${module.id}/review`} replace />;
  }

  const annotationMap = Object.fromEntries(
    scenario.annotationBank.map((annotation) => [
      annotation.id,
      annotation.text,
    ]),
  );

  return (
    <>
      <ModuleHeader
        module={module}
        step={5}
        title="תמונת הבקרה שלכם"
        description="התוצאה מפרידה בין טעויות שנמצאו, סימוני שווא וטעויות שלא נמצאו."
      />
      <div className="page-section page-section--soft">
        <div className="container results-layout">
          <section className="score-card" aria-labelledby="score-title">
            <div
              className={`score-gauge ${
                result.score.total >=
                scenario.scoringRules.recommendedReviewThreshold
                  ? "is-good"
                  : "is-review"
              }`}
            >
              <span>{result.score.total}</span>
              <small>%</small>
            </div>
            <div>
              <span className="eyebrow">רמת שליטה</span>
              <h2 id="score-title">
                {result.score.total >=
                scenario.scoringRules.recommendedReviewThreshold
                  ? "שליטה טובה בעקרונות הבקרה"
                  : "מומלץ לחזור על נקודות המפתח"}
              </h2>
              <p>
                הציון משקלל מציאת טעויות, התאמת סוג ההערה והימנעות
                מסימוני שווא.
              </p>
            </div>
            <dl className="score-breakdown">
              <div>
                <dt>טעויות שנמצאו</dt>
                <dd>{result.score.foundErrorsScore}%</dd>
              </div>
              <div>
                <dt>סוג הערה נכון</dt>
                <dd>{result.score.annotationAccuracyScore}%</dd>
              </div>
              <div>
                <dt>הימנעות מסימון שווא</dt>
                <dd>{result.score.falsePositiveAvoidanceScore}%</dd>
              </div>
            </dl>
          </section>

          <section className="result-details" aria-labelledby="details-title">
            <div className="section-heading section-heading--compact">
              <div>
                <span className="eyebrow">פירוט לפי חלק</span>
                <h2 id="details-title">מה זוהה ומה כדאי לחדד</h2>
              </div>
            </div>
            <div className="result-list">
              {scenario.documentBlocks.map((block, index) => {
                const blockResult = result.blocks.find(
                  (candidate) => candidate.blockId === block.id,
                )!;
                return (
                  <article
                    className={`result-item result-item--${blockResult.state}`}
                    key={block.id}
                  >
                    <div className="result-item__status">
                      <span>
                        {blockResult.state === "correct" ||
                        blockResult.state === "clean" ? (
                          <Icon name="check" />
                        ) : (
                          <Icon name="warning" />
                        )}
                      </span>
                      <small>{stateLabels[blockResult.state]}</small>
                    </div>
                    <div className="result-item__body">
                      <span className="result-item__index">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <h3>{block.label}</h3>
                      <p className="result-item__quote">{block.content}</p>
                      <div className="result-columns">
                        <div>
                          <strong>הסימון שלכם</strong>
                          <p>
                            {blockResult.selectedAnnotations.length
                              ? blockResult.selectedAnnotations
                                  .map((id) =>
                                    id === CLEAN_ANNOTATION_ID
                                      ? "החלק תקין"
                                      : annotationMap[id],
                                  )
                                  .join(" · ")
                              : "לא סומן"}
                          </p>
                        </div>
                        <div>
                          <strong>מה היה צריך לזהות</strong>
                          <p>
                            {block.expectedAnnotations.length
                              ? block.expectedAnnotations
                                  .map((id) => annotationMap[id])
                                  .join(" · ")
                              : "החלק תקין"}
                          </p>
                        </div>
                      </div>
                      <div className="professional-feedback">
                        <Icon name="book" />
                        <p>{block.explanation}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <footer className="sticky-footer">
        <div className="container sticky-footer__inner">
          <Link
            className="button button--ghost"
            to={`/module/${module.id}/review`}
          >
            חזרה לתרגיל
          </Link>
          <Link
            className="button button--primary"
            to={`/module/${module.id}/summary`}
          >
            מעבר לסיכום הנושא
            <Icon name="arrow-left" />
          </Link>
        </div>
      </footer>
    </>
  );
}
