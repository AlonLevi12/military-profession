import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HelpDrawer } from "../components/HelpDrawer";
import { Icon } from "../components/Icon";
import { ResetDialog } from "../components/ResetDialog";

export function AppLayout() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const location = useLocation();
  const isRoadmap = location.pathname === "/";

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/" aria-label="המקצוע הצבאי — דף הבית">
            <span className="brand__mark" aria-hidden="true">
              <Icon name="compass" />
            </span>
            <span>
              <strong>המקצוע הצבאי</strong>
              <small>לומדה אינטראקטיבית</small>
            </span>
          </Link>
          <nav className="header-actions" aria-label="פעולות מערכת">
            {!isRoadmap && (
              <Link className="button button--ghost button--small" to="/">
                <Icon name="map" />
                למפת הלמידה
              </Link>
            )}
            <button
              className="icon-button"
              type="button"
              onClick={() => setHelpOpen(true)}
              aria-label="פתיחת עזרה"
            >
              <Icon name="help" />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={() => setResetOpen(true)}
              aria-label="איפוס כל ההתקדמות"
            >
              <Icon name="reset" />
            </button>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ResetDialog
        open={resetOpen}
        mode="all"
        onClose={() => setResetOpen(false)}
      />
    </div>
  );
}
