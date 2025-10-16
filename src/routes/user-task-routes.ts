import { Router } from "express";

import { UserTaskController } from "@/controllers/UserTaskController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const userTaskRoutes = Router();
const userTaskController = new UserTaskController();

userTaskRoutes.use(ensureAuthenticated);
userTaskRoutes.post("/", userTaskController.create);
userTaskRoutes.delete("/:taskId/:userId", userTaskController.delete);
userTaskRoutes.get("/user/:userId", userTaskController.showTasksByUser);
userTaskRoutes.get("/task/:taskId", userTaskController.showByTask);

export { userTaskRoutes };

