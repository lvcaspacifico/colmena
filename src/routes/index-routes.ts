import { Router } from "express";
import { userRoutes } from "./user-routes";
import { sessionRoutes } from "./session-routes";
import { projectRoutes } from "./project-routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionRoutes);
routes.use("/projects", projectRoutes);

export { routes }