import { Request, Response } from "express"
import { InternalAppError } from "@/utils/Errors/InternalAppError"
import { authConfig } from "@/configs/auth"
import { prisma } from "@/database/prisma"
import { sign, SignOptions } from "jsonwebtoken"
import { compare } from "bcrypt"
import { z } from "zod"
import { hash } from "bcrypt";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email({ message: "Invalid email format" }),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw new InternalAppError("Invalid credentials", 401)
    }
    
    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new InternalAppError("Invalid credentials", 401)
    }
    const { secret, expiresIn } = authConfig.jwt
    
    if (!secret) {
      throw new InternalAppError("Invalid credentials | Internal settings", 500)
    }

    const token = sign(
      { role: user.roleCode },
      secret,
      {
        subject: String(user.id),
        expiresIn: expiresIn
      } as SignOptions
    )

    const { password: _, ...userWithoutPassword } = user

    response.json({ token, user: userWithoutPassword })
  }
}

export { SessionsController }