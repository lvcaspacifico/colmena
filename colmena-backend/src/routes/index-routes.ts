import { Router } from "express";
import { userRoutes } from "./user-routes";
import { sessionRoutes } from "./session-routes";
import { projectRoutes } from "./project-routes";
import { labelRoutes } from "./label-routes";
import { projectLabelRoutes } from "./project-label-routes";
import { taskLabelRoutes } from "./task-label-routes";
import { taskRoutes } from "./task-routes";
import { userTaskRoutes } from "./user-task-routes";
import { userProjectRoutes } from "./user-project-routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionRoutes);
routes.use("/projects", projectRoutes);
routes.use("/labels", labelRoutes);
routes.use("/tasks", taskRoutes);
routes.use("/project-label", projectLabelRoutes);
routes.use("/task-label", taskLabelRoutes);
routes.use("/user-task", userTaskRoutes);
routes.use("/user-project", userProjectRoutes);

export { routes }