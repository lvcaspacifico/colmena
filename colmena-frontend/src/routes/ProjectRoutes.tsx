import { Routes, Route } from "react-router";
import { NotFoundPage } from "../pages/Generals/NotFoundPage";
import { CreateProjectPage } from "../pages/Project/CreateProjectPage"; 
import { ProjectsPage } from "../pages/Project/ProjectsPage";
import { ProjectDetailsPage } from "../pages/Project/ProjectDetailsPage";
import { EditProjectPage } from "../pages/Project/EditProjectPage";

export function ProjectRoutes() {
  return (
    <Routes>
        <Route path="/" element={<ProjectsPage />}/>
        <Route path="create-project" element={<CreateProjectPage />} />
        <Route path="edit-project/:id" element={<EditProjectPage />} />
        <Route path="project-details/:id" element={<ProjectDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}