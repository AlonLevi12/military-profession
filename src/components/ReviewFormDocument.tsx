import type {
  DocumentBlock,
  ModuleContent,
  ReviewScenario,
} from "../types/content";
import { CLEAN_ANNOTATION_ID } from "../utils/review";
import { Icon } from "./Icon";

interface ReviewFormDocumentProps {
  module: ModuleContent;
  scenario: ReviewScenario;
  activeBlockId: string;
  answers: Record<string, string[]>;
  annotationMap: Record<string, string>;
  reviewedCount: number;
  onBlockClick: (blockId: string) => void;
}

const reviewMetadata: Record<
  ModuleContent["id"],
  Array<{ term: string; value: string }>
> = {
  paka: [
    { term: "מסמך", value: "פקודת ארגון" },
    { term: "מועד", value: "15.7" },
    { term: "סטטוס", value: "טיוטה לבקרה" },
  ],
  risk: [
    { term: "מסמך", value: "טבלת סיכונים" },
    { term: "שלב", value: "לפני ביצוע" },
    { term: "סטטוס", value: "נדרש אישור" },
  ],
  debrief: [
    { term: "מסמך", value: "דוח תחקיר" },
    { term: "מוקד", value: "עיכוב וחוסר ציוד" },
    { term: "סטטוס", value: "לבקרת איכות" },
  ],
};

export function ReviewFormDocument({
  module,
  scenario,
  activeBlockId,
  answers,
  annotationMap,
  reviewedCount,
  onBlockClick,
}: ReviewFormDocumentProps) {
  const renderAnnotationChips = (block: DocumentBlock) => {
    const blockAnswers = answers[block.id] ?? [];
    if (blockAnswers.length === 0) {
      return <span className="review-form-block__empty">טרם סומן</span>;
    }

    return (
      <span className="annotation-chips">
        {blockAnswers.map((annotationId) => (
          <small key={annotationId}>
            {annotationId === CLEAN_ANNOTATION_ID
              ? "החלק תקין"
              : annotationMap[annotationId]}
          </small>
        ))}
      </span>
    );
  };

  const renderReviewBlock = (block: DocumentBlock, index: number) => {
    const blockAnswers = answers[block.id] ?? [];
    const isActive = block.id === activeBlockId;

    return (
      <button
        type="button"
        key={block.id}
        className={[
          "review-form-block",
          isActive ? "is-active" : "",
          blockAnswers.length ? "is-annotated" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => onBlockClick(block.id)}
        aria-pressed={isActive}
      >
        <span className="review-form-block__number">
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <span className="review-form-block__body">
          <strong>{block.label}</strong>
          <span>{block.content}</span>
          {renderAnnotationChips(block)}
        </span>
        <Icon name="chevron" />
      </button>
    );
  };

  const renderRiskTable = () => (
    <div className="review-form-table" role="table" aria-label={scenario.title}>
      <div className="review-form-table__head" role="row">
        <span role="columnheader">מס׳</span>
        <span role="columnheader">מוקד בטבלה</span>
        <span role="columnheader">תוכן השורה</span>
        <span role="columnheader">סימון הבקרה</span>
      </div>
      {scenario.documentBlocks.map((block, index) => {
        const blockAnswers = answers[block.id] ?? [];
        const isActive = block.id === activeBlockId;

        return (
          <button
            type="button"
            className={[
              "review-form-table__row",
              isActive ? "is-active" : "",
              blockAnswers.length ? "is-annotated" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={block.id}
            onClick={() => onBlockClick(block.id)}
            aria-pressed={isActive}
          >
            <span role="cell">{(index + 1).toString().padStart(2, "0")}</span>
            <strong role="cell">{block.label}</strong>
            <span role="cell">{block.content}</span>
            <span role="cell">{renderAnnotationChips(block)}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      className={`review-document review-document--form review-document--${module.id}`}
      aria-labelledby="review-title"
    >
      <header>
        <div>
          <span className="eyebrow">מסמך לבדיקה</span>
          <h2 id="review-title">{scenario.title}</h2>
        </div>
        <span className="review-counter">
          {reviewedCount}/{scenario.documentBlocks.length} חלקים נבדקו
        </span>
      </header>

      <div className={`military-form review-form military-form--${module.id}`}>
        <div className="military-form__classification">בלמ״ס</div>
        <div className="review-form__meta">
          {reviewMetadata[module.id].map((item) => (
            <span key={item.term}>
              <strong>{item.term}:</strong> {item.value}
            </span>
          ))}
        </div>

        {module.id === "risk" ? (
          renderRiskTable()
        ) : (
          <div className="military-form__section military-form__section--review">
            {scenario.documentBlocks.map((block, index) => (
              <section className="military-form__chapter" key={block.id}>
                <h3>
                  {index + 1}. {block.label}
                </h3>
                {renderReviewBlock(block, index)}
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
