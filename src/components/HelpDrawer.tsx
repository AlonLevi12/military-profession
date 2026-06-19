import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

interface HelpDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function HelpDrawer({ open, onClose }: HelpDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer__header">
          <div>
            <span className="eyebrow">עזרה קצרה</span>
            <h2 id="help-title">איך משתמשים בלומדה?</h2>
          </div>
          <button
            ref={closeRef}
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="סגירת עזרה"
          >
            ×
          </button>
        </div>
        <ol className="help-steps">
          <li>
            <Icon name="book" />
            <span>
              <strong>מכירים את המסמך</strong>
              קוראים למה הוא נועד ומתי משתמשים בו.
            </span>
          </li>
          <li>
            <Icon name="document" />
            <span>
              <strong>בונים באופן מודרך</strong>
              בוחרים חלק במסמך, לומדים את תפקידו ומאשרים תוכן מתאים.
            </span>
          </li>
          <li>
            <Icon name="search" />
            <span>
              <strong>מבקרים מסמך קיים</strong>
              מסמנים טעויות וחוסרים. המשוב מופיע רק לאחר ההגשה.
            </span>
          </li>
        </ol>
        <div className="callout callout--soft">
          <Icon name="help" />
          <p>
            אפשר לבצע את כל הפעולות במקלדת. ההתקדמות נשמרת אוטומטית
            בדפדפן, ללא שמירת פרטים אישיים.
          </p>
        </div>
      </aside>
    </div>
  );
}
