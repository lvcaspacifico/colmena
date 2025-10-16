import { Router } from "express";

import { ProjectController } from "@/controllers/ProjectController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const projectRoutes = Router();
const projectController = new ProjectController();

projectRoutes.use(ensureAuthenticated);
projectRoutes.get("/", projectController.index);
projectRoutes.get("/project/:id", projectController.show);
projectRoutes.post("/", projectController.create);
projectRoutes.put("/:id", projectController.update);
projectRoutes.delete("/:id", projectController.delete);

export { projectRoutes };

