import { Router } from "express";

import { TaskLabelController } from "@/controllers/TaskLabelController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const taskLabelRoutes = Router();
const taskLabelController = new TaskLabelController();

taskLabelRoutes.use(ensureAuthenticated);
taskLabelRoutes.post("/", taskLabelController.create);
taskLabelRoutes.delete("/:taskId/:labelId", taskLabelController.delete);

export { taskLabelRoutes };

