import { Router } from "express";
import { userRoutes } from "./user-routes";
import { sessionRoutes } from "./session-routes";
import { projectRoutes } from "./project-routes";
import { labelRoutes } from "./label-routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionRoutes);
routes.use("/projects", projectRoutes);
routes.use("/labels", labelRoutes);

export { routes }