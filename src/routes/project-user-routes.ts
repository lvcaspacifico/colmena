import { Router } from "express";

import { ProjectUserController } from "@/controllers/ProjectUserController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const projectUserRoutes = Router();
const projectUserController = new ProjectUserController();

projectUserRoutes.use(ensureAuthenticated);
projectUserRoutes.post("/", projectUserController.create);
projectUserRoutes.delete("/:projectId/:userId", projectUserController.delete);
projectUserRoutes.get("/user/:userId", projectUserController.showProjectsByUser);
projectUserRoutes.get("/project/:projectId", projectUserController.showByProject);

export { projectUserRoutes };

