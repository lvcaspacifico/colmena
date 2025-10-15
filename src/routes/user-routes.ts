import { Router } from "express";

import { UserController } from "@/controllers/UserController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";
import { createUserLimiter } from "@/middlewares/create-user-limiter";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/", ensureAuthenticated, userController.index);
userRoutes.post("/", createUserLimiter, userController.create);
userRoutes.put("/:id", ensureAuthenticated, userController.update);
userRoutes.delete("/:id", ensureAuthenticated, userController.create);

export { userRoutes };

