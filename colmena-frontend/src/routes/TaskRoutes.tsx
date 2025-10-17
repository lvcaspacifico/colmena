import { Routes, Route } from "react-router";
import { NotFoundPage } from "../pages/Generals/NotFoundPage";

import { TasksPage } from "../pages/Task/TasksPage";
import { CreateTaskPage } from "../pages/Task/CreateTaskPage";
import { EditTaskPage } from "../pages/Task/EditTaskPage";
import { TaskDetailsPage } from "../pages/Task/TaskDetailsPage";

export function TaskRoutes() {
  return (
    <Routes>
        <Route path="/" element={<TasksPage />}/>
        <Route path="create-task" element={<CreateTaskPage />} />
        <Route path="edit-task/:id" element={<EditTaskPage />} />
        <Route path="task-details/:id" element={<TaskDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}