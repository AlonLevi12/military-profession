import { Link, Navigate } from "react-router-dom";
import { DocumentPreview } from "../components/DocumentPreview";
import { Icon } from "../components/Icon";
import { ModuleHeader } from "../components/ModuleHeader";
import { StageGuide } from "../components/StageGuide";
import { useModuleContent } from "../hooks/useModuleContent";
import { useProgressStore } from "../store/progressStore";

export function CompletedDocumentPage() {
  const module = useModuleContent();
  const progress = useProgressStore((state) =>
    module ? state.builderAnswers[module.id] : undefined,
  );

  if (!module) return <Navigate to="/" replace />;
  if (
    !progress ||
    progress.completedSectionIds.length !== module.documentSections.length
  ) {
    return <Navigate to={`/module/${module.id}/builder`} replace />;
  }

  return (
    <>
      <ModuleHeader
        module={module}
        step={3}
        title="המסמך שבניתם"
        description="כל חלק ממלא תפקיד אחר. עברו על המסמך השלם לפני שתעברו לבקר מסמך חדש."
      />
      <StageGuide
        eyebrow="שלב מעבר"
        title="מה עושים עם המסמך השלם?"
        description="כאן לא עונים על עוד שאלה. עוצרים לרגע וקוראים את התוצר כמו מסמך עבודה שלם, כדי לראות איך החלקים שבניתם מתחברים למסמך אחד."
        items={[
          {
            title: "סורקים את הרצף",
            text: "קראו את המסמך מלמעלה למטה ובדקו שהוא מרגיש רציף, ברור ומסודר.",
          },
          {
            title: "מבינים את תפקיד החלקים",
            text: "היעזרו ברשימת התפקידים בצד כדי לראות מה כל חלק מוסיף למסמך.",
          },
          {
            title: "מתכוננים לבקרה",
            text: "שימו לב איך מסמך תקין נראה, כי בשלב הבא תקבלו מסמך אחר ותצטרכו לזהות בו טעויות.",
          },
        ]}
        outcome="המטרה בשלב: לבסס בראש תמונה של מסמך תקין לפני מעבר לחיפוש טעויות."
      />
      <div className="page-section page-section--soft">
        <div className="container completed-layout">
          <DocumentPreview
            module={module}
            progress={progress}
            readonly
            variant="letter"
          />
          <aside className="role-summary">
            <span className="eyebrow">מבט מסכם</span>
            <h2>תפקידו של כל חלק</h2>
            <ol>
              {module.documentSections.map((item) => (
                <li key={item.id}>
                  <span>{item.order.toString().padStart(2, "0")}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.purpose}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
      <footer className="sticky-footer">
        <div className="container sticky-footer__inner">
          <Link
            className="button button--ghost"
            to={`/module/${module.id}/builder`}
          >
            חזרה לבנייה
          </Link>
          <Link
            className="button button--primary"
            to={`/module/${module.id}/review`}
          >
            מעבר לחיפוש טעויות
            <Icon name="search" />
          </Link>
        </div>
      </footer>
    </>
  );
}
