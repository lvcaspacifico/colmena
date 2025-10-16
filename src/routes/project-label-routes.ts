import { Router } from "express";

import { ProjectLabelController } from "@/controllers/ProjectLabelController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const projectLabelRoutes = Router();
const projectLabelController = new ProjectLabelController();

projectLabelRoutes.use(ensureAuthenticated);
projectLabelRoutes.post("/", projectLabelController.create);
projectLabelRoutes.delete("/:projectId/:labelId", projectLabelController.delete);

export { projectLabelRoutes };

