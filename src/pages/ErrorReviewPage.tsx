import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ModuleHeader } from "../components/ModuleHeader";
import { useModuleContent } from "../hooks/useModuleContent";
import { useProgressStore } from "../store/progressStore";
import { CLEAN_ANNOTATION_ID, scoreReview } from "../utils/review";

export function ErrorReviewPage() {
  const module = useModuleContent();
  const navigate = useNavigate();
  const reviewProgress = useProgressStore((state) =>
    module ? state.reviewAnswers[module.id] : undefined,
  );
  const builderProgress = useProgressStore((state) =>
    module ? state.builderAnswers[module.id] : undefined,
  );
  const setReviewAnswer = useProgressStore((state) => state.setReviewAnswer);
  const submitReview = useProgressStore((state) => state.submitReview);
  const restartReview = useProgressStore((state) => state.restartReview);
  const [activeBlockId, setActiveBlockId] = useState<string>();

  if (!module) return <Navigate to="/" replace />;
  if (
    !builderProgress ||
    builderProgress.completedSectionIds.length !==
      module.documentSections.length
  ) {
    return <Navigate to={`/module/${module.id}/builder`} replace />;
  }
  const scenario = module.reviewScenarios[0];
  const answers =
    reviewProgress?.scenarioId === scenario.id ? reviewProgress.answers : {};
  const activeBlock =
    scenario.documentBlocks.find((block) => block.id === activeBlockId) ??
    scenario.documentBlocks[0];
  const selected = answers[activeBlock.id] ?? [];
  const reviewedCount = Object.values(answers).filter(
    (values) => values.length > 0,
  ).length;

  const annotationMap = Object.fromEntries(
    scenario.annotationBank.map((annotation) => [
      annotation.id,
      annotation.text,
    ]),
  );

  const toggleAnnotation = (annotationId: string) => {
    const current = answers[activeBlock.id] ?? [];
    let next: string[];
    if (annotationId === CLEAN_ANNOTATION_ID) {
      next = current.includes(CLEAN_ANNOTATION_ID)
        ? []
        : [CLEAN_ANNOTATION_ID];
    } else {
      const withoutClean = current.filter(
        (id) => id !== CLEAN_ANNOTATION_ID,
      );
      next = withoutClean.includes(annotationId)
        ? withoutClean.filter((id) => id !== annotationId)
        : [...withoutClean, annotationId];
    }
    setReviewAnswer(module.id, scenario.id, activeBlock.id, next);
  };

  const handleSubmit = () => {
    if (
      reviewedCount < Math.ceil(scenario.documentBlocks.length / 2) &&
      !window.confirm(
        "בדקתם פחות ממחצית מחלקי המסמך. להגיש את הבקרה בכל זאת?",
      )
    ) {
      return;
    }
    const result = scoreReview(
      scenario.documentBlocks,
      answers,
      scenario.scoringRules,
      scenario.id,
    );
    submitReview(module.id, result);
    navigate(`/module/${module.id}/review/results`);
  };

  if (reviewProgress?.result) {
    return (
      <>
        <ModuleHeader
          module={module}
          step={4}
          title="הניסיון כבר הוגש"
          description="לא ניתן לשנות ניסיון לאחר בדיקה. אפשר לצפות בתוצאות או להתחיל ניסיון חדש."
        />
        <div className="page-section">
          <div className="container narrow-state">
            <span className="state-illustration">
              <Icon name="shield" />
            </span>
            <h2>הבקרה נשמרה</h2>
            <p>
              קיבלתם {reviewProgress.result.score.total}%. בתוצאות תראו
              מה נמצא נכון, מה סומן בטעות ומה הוחמץ.
            </p>
            <div className="button-row">
              <Link
                className="button button--primary"
                to={`/module/${module.id}/review/results`}
              >
                צפייה בתוצאות
              </Link>
              <button
                className="button button--ghost"
                type="button"
                onClick={() => restartReview(module.id)}
              >
                ניסיון חדש
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ModuleHeader
        module={module}
        step={4}
        title="עכשיו אתם המבקרים"
        description={scenario.instructions}
      />
      <div className="review-page">
        <div className="container review-layout">
          <section className="review-document" aria-labelledby="review-title">
            <header>
              <div>
                <span className="eyebrow">מסמך לבדיקה</span>
                <h2 id="review-title">{scenario.title}</h2>
              </div>
              <span className="review-counter">
                {reviewedCount}/{scenario.documentBlocks.length} חלקים נבדקו
              </span>
            </header>
            <div className="review-blocks">
              {scenario.documentBlocks.map((block, index) => {
                const blockAnswers = answers[block.id] ?? [];
                const isActive = block.id === activeBlock.id;
                return (
                  <button
                    type="button"
                    key={block.id}
                    className={`review-block ${isActive ? "is-active" : ""} ${
                      blockAnswers.length ? "is-annotated" : ""
                    }`}
                    onClick={() => setActiveBlockId(block.id)}
                    aria-pressed={isActive}
                  >
                    <span className="review-block__number">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="review-block__content">
                      <strong>{block.label}</strong>
                      <span>{block.content}</span>
                      {blockAnswers.length > 0 && (
                        <span className="annotation-chips">
                          {blockAnswers.map((annotationId) => (
                            <small key={annotationId}>
                              {annotationId === CLEAN_ANNOTATION_ID
                                ? "החלק תקין"
                                : annotationMap[annotationId]}
                            </small>
                          ))}
                        </span>
                      )}
                    </span>
                    <Icon name="chevron" />
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="annotation-panel">
            <div className="annotation-panel__header">
              <span className="eyebrow">החלק הנבחר</span>
              <h2>{activeBlock.label}</h2>
              <p>אילו הערות מתאימות? אפשר לבחור יותר מאחת.</p>
            </div>
            <div className="annotation-bank">
              {scenario.annotationBank.map((annotation) => (
                <label
                  key={annotation.id}
                  className={
                    selected.includes(annotation.id)
                      ? "annotation-option is-selected"
                      : "annotation-option"
                  }
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(annotation.id)}
                    onChange={() => toggleAnnotation(annotation.id)}
                  />
                  <span>
                    <Icon name="check" />
                  </span>
                  {annotation.text}
                </label>
              ))}
              <div className="annotation-divider">
                <span>או</span>
              </div>
              <label
                className={
                  selected.includes(CLEAN_ANNOTATION_ID)
                    ? "annotation-option annotation-option--clean is-selected"
                    : "annotation-option annotation-option--clean"
                }
              >
                <input
                  type="checkbox"
                  checked={selected.includes(CLEAN_ANNOTATION_ID)}
                  onChange={() => toggleAnnotation(CLEAN_ANNOTATION_ID)}
                />
                <span>
                  <Icon name="shield" />
                </span>
                החלק תקין
              </label>
            </div>
            <p className="privacy-note">
              <Icon name="help" />
              אפשר לשנות את הסימונים עד להגשת המסמך. בשלב זה לא יוצג
              משוב.
            </p>
          </aside>
        </div>
      </div>
      <footer className="sticky-footer">
        <div className="container sticky-footer__inner">
          <Link
            className="button button--ghost"
            to={`/module/${module.id}/completed`}
          >
            חזרה למסמך שבניתם
          </Link>
          <button
            className="button button--primary"
            type="button"
            onClick={handleSubmit}
          >
            בדיקת המסמך
            <Icon name="check" />
          </button>
        </div>
      </footer>
    </>
  );
}
