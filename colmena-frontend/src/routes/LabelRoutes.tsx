import { Routes, Route } from "react-router";
import { NotFoundPage } from "../pages/Generals/NotFoundPage";

import { LabelsPage } from "../pages/Label/LabelsPage";

export function LabelRoutes() {
  return (
    <Routes>
        <Route path="/" element={<LabelsPage/>}/>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}