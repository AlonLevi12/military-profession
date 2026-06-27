import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ModuleHeader } from "../components/ModuleHeader";
import { ReviewFormDocument } from "../components/ReviewFormDocument";
import { StageGuide } from "../components/StageGuide";
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
        description={scenario.instructions}
      />
      <StageGuide
        eyebrow="לפני הבקרה"
        title="מה עושים בחיפוש הטעויות?"
        description="בשלב הזה אתם מקבלים מסמך אחר ומבקרים אותו. לא מתקנים את הטקסט בעצמכם, אלא מחליטים לכל חלק האם הוא תקין או אילו הערות מקצועיות מתאימות לו."
        items={[
          {
            title: "בוחרים חלק במסמך",
            text: "לחצו על חלק במסמך כדי לראות בצד את בנק ההערות שמתאים לבדיקה.",
          },
          {
            title: "מסמנים הערות או תקין",
            text: "בחרו את כל ההערות המתאימות, או סמנו שהחלק תקין אם אין בו בעיה.",
          },
          {
            title: "מגישים לבדיקה",
            text: "בסוף מגישים את המסמך ומקבלים משוב על מה זוהה נכון, מה הוחמץ ומה סומן בטעות.",
          },
        ]}
        outcome="המטרה בשלב: לתרגל בקרה מקצועית — לזהות טעויות בלי לסמן יותר מדי ובלי לפספס חלקים בעייתיים."
      />
      <div className="review-page">
        <div className="container review-layout">
          <ReviewFormDocument
            module={module}
            scenario={scenario}
            activeBlockId={activeBlock.id}
            answers={answers}
            annotationMap={annotationMap}
            reviewedCount={reviewedCount}
            onBlockClick={setActiveBlockId}
          />

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
