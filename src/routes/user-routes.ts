import { Router } from "express";

import { UserController } from "@/controllers/UserController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";
import { createUserLimiter } from "@/middlewares/create-user-limiter";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/", createUserLimiter, userController.create);
userRoutes.use(ensureAuthenticated);
userRoutes.get("/", userController.index);
userRoutes.get("/user/:id", userController.show);
userRoutes.put("/:id", userController.update);
userRoutes.delete("/:id", userController.delete);

export { userRoutes };

