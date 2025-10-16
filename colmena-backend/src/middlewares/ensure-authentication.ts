import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { InternalAppError } from "@/utils/Errors/InternalAppError";

interface TokenPayload extends JwtPayload {
  role: number;
  sub: string;
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new InternalAppError("JWT token not found", 401);

    const [, token] = authHeader.split(" ");
    if (!authConfig.jwt.secret) throw new InternalAppError("JWT secret not configured", 500);

    const decoded = verify(token, authConfig.jwt.secret) as TokenPayload;

    if (!decoded?.sub || !decoded?.role) {
      throw new InternalAppError("Invalid JWT token payload", 401);
    }

    request.user = {
      id: Number(decoded.sub),
      roleCode: decoded.role,
    };

    return next();
  } catch (error) {
    throw new InternalAppError("Invalid JWT token", 401);
  }
}

export { ensureAuthenticated };