import { Router } from "express";

import { UserProjectController } from "@/controllers/UserProjectController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const userProjectRoutes = Router();
const userProjectController = new UserProjectController();

userProjectRoutes.use(ensureAuthenticated);
userProjectRoutes.post("/", userProjectController.create);
userProjectRoutes.delete("/:projectId/:userId", userProjectController.delete);
userProjectRoutes.get("/user/:userId", userProjectController.showProjectsByUser);
userProjectRoutes.get("/project/:projectId", userProjectController.showByProject);

export { userProjectRoutes };

