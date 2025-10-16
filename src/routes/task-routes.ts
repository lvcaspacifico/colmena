import { Router } from "express";

import { TaskController } from "@/controllers/TaskController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(ensureAuthenticated);
taskRoutes.get("/", taskController.index);
taskRoutes.get("/task/:id", taskController.show);
taskRoutes.post("/", taskController.create);
taskRoutes.put("/:id", taskController.update);
taskRoutes.delete("/:id", taskController.delete);

export { taskRoutes };

