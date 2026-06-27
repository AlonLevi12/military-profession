import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { DocumentPreview } from "../components/DocumentPreview";
import { Icon } from "../components/Icon";
import { ModuleHeader } from "../components/ModuleHeader";
import { RiskMatrix } from "../components/RiskMatrix";
import { sectionLessonsByModule } from "../content/sectionLessons";
import { useModuleContent } from "../hooks/useModuleContent";
import { useProgressStore } from "../store/progressStore";
import {
  getAvailableSectionIds,
  stableShuffle,
  validateBuilderSelection,
} from "../utils/builder";

interface FeedbackState {
  type: "success" | "error";
  title: string;
  message: string;
}

export function DocumentBuilderPage() {
  const module = useModuleContent();
  const builderProgress = useProgressStore((state) =>
    module ? state.builderAnswers[module.id] : undefined,
  );
  const recordAttempt = useProgressStore(
    (state) => state.recordBuilderAttempt,
  );
  const [activeSectionId, setActiveSectionId] = useState<string>();
  const [selection, setSelection] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>();
  const feedbackRef = useRef<HTMLDivElement>(null);

  const completedIds = builderProgress?.completedSectionIds ?? [];
  const availableIds = useMemo(
    () =>
      module
        ? getAvailableSectionIds(module.documentSections, completedIds)
        : [],
    [module, completedIds],
  );

  const activeSection = module?.documentSections.find(
    (candidate) => candidate.id === activeSectionId,
  );
  const activeLesson =
    module && activeSection
      ? sectionLessonsByModule[module.id][activeSection.id]
      : undefined;
  const nextAvailableIncompleteSection = useMemo(() => {
    if (!module || !activeSection) return undefined;

    const activeIndex = module.documentSections.findIndex(
      (candidate) => candidate.id === activeSection.id,
    );
    const isAvailableAndIncomplete = (
      candidate: (typeof module.documentSections)[number],
    ) =>
      availableIds.includes(candidate.id) && !completedIds.includes(candidate.id);

    return (
      module.documentSections
        .slice(activeIndex + 1)
        .find(isAvailableAndIncomplete) ??
      module.documentSections.find(isAvailableAndIncomplete)
    );
  }, [activeSection, availableIds, completedIds, module]);

  useEffect(() => {
    if (!module || activeSectionId) return;
    const firstIncomplete =
      module.documentSections.find(
        (item) =>
          availableIds.includes(item.id) && !completedIds.includes(item.id),
      ) ?? module.documentSections[0];
    setActiveSectionId(firstIncomplete.id);
  }, [module, activeSectionId, availableIds, completedIds]);

  useEffect(() => {
    setSelection([]);
    setFeedback(undefined);
  }, [activeSectionId]);

  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  if (!module) return <Navigate to="/" replace />;

  const isComplete =
    completedIds.length === module.documentSections.length;
  const isActiveSectionCompleted = activeSection
    ? completedIds.includes(activeSection.id)
    : false;
  const shouldShowContinueButton =
    isActiveSectionCompleted && feedback?.type === "success";
  const attempts = activeSection
    ? (builderProgress?.attempts[activeSection.id] ?? 0)
    : 0;
  const options = activeSection
    ? stableShuffle(activeSection.options, `${module.id}:${activeSection.id}`)
    : [];

  const handleSelect = (optionId: string) => {
    if (!activeSection) return;
    setFeedback(undefined);
    setSelection((current) =>
      activeSection.selectionMode === "single"
        ? [optionId]
        : current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
    );
  };

  const handleCheck = () => {
    if (!activeSection || selection.length === 0) return;
    const isCorrect = validateBuilderSelection(activeSection, selection);
    recordAttempt(module.id, activeSection.id, selection, isCorrect);
    const selectedOptions = activeSection.options.filter((candidate) =>
      selection.includes(candidate.id),
    );

    if (isCorrect) {
      setFeedback({
        type: "success",
        title: "החלק הושלם",
        message:
          selectedOptions[0]?.feedbackCorrect ??
          "התוכן מתאים למטרת החלק במסמך.",
      });
      return;
    }

    setFeedback({
      type: "error",
      title: "כדאי לנסות שוב",
      message:
        selectedOptions
          .map((candidate) => candidate.feedbackIncorrect)
          .filter(Boolean)
          .join(" ") || "הבחירה אינה מתאימה לתפקיד החלק במסמך.",
    });
  };

  const handleContinueToNextSection = () => {
    if (!nextAvailableIncompleteSection) return;
    setActiveSectionId(nextAvailableIncompleteSection.id);
  };

  return (
    <>
      <ModuleHeader
        module={module}
        step={2}
        title="בונים את המסמך, חלק אחר חלק"
        description="בחרו חלק זמין במסמך, למדו מה תפקידו והשלימו אותו מתוך בנק האפשרויות."
      />
      <div className="builder-page">
        <div className="container builder-layout">
          <div className="builder-document">
            <div className="builder-progress">
              <span>
                {completedIds.length} מתוך {module.documentSections.length}{" "}
                חלקים הושלמו
              </span>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={module.documentSections.length}
                aria-valuenow={completedIds.length}
              >
                <span
                  style={{
                    width: `${(completedIds.length / module.documentSections.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <DocumentPreview
              module={module}
              progress={builderProgress}
              activeSectionId={activeSectionId}
              availableSectionIds={availableIds}
              onSectionClick={setActiveSectionId}
            />
          </div>

          <aside className="learning-panel" aria-label="פאנל למידה">
            {activeSection && (
              <>
                <div className="learning-panel__header">
                  <span className="section-number">
                    {activeSection.order.toString().padStart(2, "0")}
                  </span>
                  <div>
                    <span className="eyebrow">החלק הנבחר</span>
                    <h2>{activeSection.title}</h2>
                  </div>
                </div>

                <div className="learning-panel__explanation">
                  <div>
                    <strong>מטרת החלק</strong>
                    <p>{activeSection.purpose}</p>
                  </div>
                  <div>
                    <strong>מה צריך להיכלל?</strong>
                    <p>{activeSection.whatBelongs}</p>
                  </div>
                  <div className="mistake-note">
                    <Icon name="warning" />
                    <span>
                      <strong>טעות נפוצה</strong>
                      {activeSection.commonMistakes}
                    </span>
                  </div>
                </div>

                {activeLesson && (
                  <section className="section-lesson">
                    <div className="section-lesson__header">
                      <span className="eyebrow">חומר מקצועי לחלק</span>
                      <h3>{activeLesson.title}</h3>
                    </div>
                    <p className="section-lesson__principle">
                      {activeLesson.principle}
                    </p>

                    {activeLesson.terms && (
                      <dl className="section-lesson__terms">
                        {activeLesson.terms.map((term) => (
                          <div key={term.term}>
                            <dt>{term.term}</dt>
                            <dd>{term.definition}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="section-lesson__block">
                      <strong>עקרונות לזכור</strong>
                      <ul>
                        {activeLesson.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="section-lesson__check">
                      <strong>בדיקה לפני בחירה</strong>
                      <ol>
                        {activeLesson.checkQuestions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="section-lesson__example">
                      <strong>דוגמה תקינה</strong>
                      <p>{activeLesson.example}</p>
                    </div>
                  </section>
                )}

                {module.id === "risk" &&
                  ["severity", "likelihood", "initial-level", "residual"].includes(
                    activeSection.id,
                  ) && <RiskMatrix />}

                {isActiveSectionCompleted && !shouldShowContinueButton ? (
                  <div className="completed-panel">
                    <span>
                      <Icon name="check" />
                    </span>
                    <h3>החלק כבר הושלם</h3>
                    <p>
                      אפשר לעבור לחלק זמין אחר במסמך. הבחירה נשמרה
                      אוטומטית.
                    </p>
                  </div>
                ) : (
                  <fieldset className="option-bank">
                    <legend>איזו אפשרות מתאימה לחלק?</legend>
                    {options.map((candidate, index) => (
                      <label
                        className={
                          selection.includes(candidate.id)
                            ? "option-card is-selected"
                            : "option-card"
                        }
                        key={candidate.id}
                      >
                        <input
                          type={
                            activeSection.selectionMode === "single"
                              ? "radio"
                              : "checkbox"
                          }
                          name={`section-${activeSection.id}`}
                          checked={selection.includes(candidate.id)}
                          disabled={shouldShowContinueButton}
                          onChange={() => handleSelect(candidate.id)}
                        />
                        <span className="option-card__marker">
                          {String.fromCharCode(1488 + index)}
                        </span>
                        <span>{candidate.text}</span>
                      </label>
                    ))}
                    {attempts >= 2 && (
                      <p className="hint">
                        <Icon name="spark" />
                        רמז: חזרו למטרת החלק ובדקו האם האפשרות מתארת את
                        התוצאה, את אופן הביצוע או את האחריות — בלי לערבב
                        ביניהם.
                      </p>
                    )}
                    {shouldShowContinueButton ? (
                      nextAvailableIncompleteSection ? (
                        <button
                          className="button button--primary button--full"
                          type="button"
                          onClick={handleContinueToNextSection}
                        >
                          עבור לסעיף הבא
                          <Icon name="arrow-left" />
                        </button>
                      ) : (
                        <Link
                          className="button button--primary button--full"
                          to={`/module/${module.id}/completed`}
                        >
                          צפייה במסמך שהושלם
                          <Icon name="arrow-left" />
                        </Link>
                      )
                    ) : (
                      <button
                        className="button button--primary button--full"
                        type="button"
                        disabled={selection.length === 0}
                        onClick={handleCheck}
                      >
                        בדיקת הבחירה
                      </button>
                    )}
                  </fieldset>
                )}

                {feedback && (
                  <div
                    ref={feedbackRef}
                    className={`feedback feedback--${feedback.type}`}
                    role="status"
                    aria-live="polite"
                    tabIndex={-1}
                  >
                    <Icon
                      name={feedback.type === "success" ? "check" : "help"}
                    />
                    <div>
                      <strong>{feedback.title}</strong>
                      <p>{feedback.message}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
      <footer className="sticky-footer">
        <div className="container sticky-footer__inner">
          <Link
            className="button button--ghost"
            to={`/module/${module.id}/intro`}
          >
            חזרה למבוא
          </Link>
          <Link
            className={`button button--primary ${!isComplete ? "is-disabled" : ""}`}
            aria-disabled={!isComplete}
            tabIndex={isComplete ? 0 : -1}
            to={
              isComplete ? `/module/${module.id}/completed` : location.pathname
            }
            onClick={(event) => {
              if (!isComplete) event.preventDefault();
            }}
          >
            צפייה במסמך שהושלם
            <Icon name="arrow-left" />
          </Link>
        </div>
      </footer>
    </>
  );
}
