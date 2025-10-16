import { Router } from "express";

import { LabelController } from "@/controllers/LabelController";
import { ensureAuthenticated } from "@/middlewares/ensure-authentication";

const labelRoutes = Router();
const labelController = new LabelController();

labelRoutes.use(ensureAuthenticated);
labelRoutes.get("/", labelController.index);
labelRoutes.get("/project", labelController.showForProject);
labelRoutes.get("/task", labelController.showForTask);
labelRoutes.get("/label/:id", labelController.show);
labelRoutes.post("/", labelController.create);
labelRoutes.put("/:id", labelController.update);
labelRoutes.delete("/:id", labelController.delete);

export { labelRoutes };

