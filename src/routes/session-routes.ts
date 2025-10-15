import { Router } from "express"

import { SessionsController } from "@/controllers/SessionController"

const sessionRoutes = Router()
const sessionController = new SessionsController()

sessionRoutes.post("/", sessionController.create)

export { sessionRoutes }
