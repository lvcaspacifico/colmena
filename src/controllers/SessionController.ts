import { Request, Response } from "express"
import { InternalAppError } from "@/utils/Errors/InternalAppError"
import { authConfig } from "@/configs/auth"
import { prisma } from "@/database/prisma"
import { sign, SignOptions } from "jsonwebtoken"
import { compare } from "bcrypt"
import { z } from "zod"

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
      throw new InternalAppError("Invalid credentials e", 401)
    }
    console.log("SENHA do banco ===============" + user.password);
    console.log("SENHA enviada ===============" + password);
    const passwordMatched = await compare(password, user.password)
    console.log("Did password match ================ " + passwordMatched)
    if (!passwordMatched) {
      throw new InternalAppError("Invalid credentials p", 401)
    }
    // $2b$08$je8k8370IjOuyFrTIRR4hOQu68kmiWk1thkr1wiJMnDvDP9noldHa
    // $2b$08$je8k8370IjOuyFrTIRR4hOQu68kmiWk1thkr1wiJMnDvDP9noldHa

    const { secret, expiresIn } = authConfig.jwt
    
    if (!secret) {
      throw new InternalAppError("Invalid credentials settings", 500)
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