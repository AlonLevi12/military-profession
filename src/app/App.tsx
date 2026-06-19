import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { CompletedDocumentPage } from "../pages/CompletedDocumentPage";
import { DocumentBuilderPage } from "../pages/DocumentBuilderPage";
import { ErrorReviewPage } from "../pages/ErrorReviewPage";
import { ErrorReviewResultsPage } from "../pages/ErrorReviewResultsPage";
import { ModuleIntroPage } from "../pages/ModuleIntroPage";
import { ModuleSummaryPage } from "../pages/ModuleSummaryPage";
import { RoadmapPage } from "../pages/RoadmapPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<RoadmapPage />} />
        <Route path="/module/:moduleId/intro" element={<ModuleIntroPage />} />
        <Route
          path="/module/:moduleId/builder"
          element={<DocumentBuilderPage />}
        />
        <Route
          path="/module/:moduleId/completed"
          element={<CompletedDocumentPage />}
        />
        <Route path="/module/:moduleId/review" element={<ErrorReviewPage />} />
        <Route
          path="/module/:moduleId/review/results"
          element={<ErrorReviewResultsPage />}
        />
        <Route
          path="/module/:moduleId/summary"
          element={<ModuleSummaryPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
