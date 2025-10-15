import { Request, Response, NextFunction } from "express"
import { InternalAppError } from "@/utils/Errors/InternalAppError"

function verifyUserAuthorization(role: number[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !role.includes(request.user.roleCode)) {
      throw new InternalAppError("Unauthorized", 401)
    }

    return next()
  }
}

export { verifyUserAuthorization }
