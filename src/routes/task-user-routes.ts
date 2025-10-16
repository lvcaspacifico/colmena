import { Router } from "express";

import { TaskUserController } from "@/controllers/TaskUserController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const taskUserRoutes = Router();
const taskUserController = new TaskUserController();

taskUserRoutes.use(ensureAuthenticated);
taskUserRoutes.post("/", taskUserController.create);
taskUserRoutes.delete("/:taskId/:userId", taskUserController.delete);
taskUserRoutes.get("/user/:userId", taskUserController.showTasksByUser);
taskUserRoutes.get("/task/:taskId", taskUserController.showByTask);

export { taskUserRoutes };

