import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UserController {
    async index(request: Request, response: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        email: true,
        roleCode: true,
        birthdate: true,
        createdAt: true,
      },
    });

    return response.json(users);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    if (!id) {
      throw new InternalAppError("User ID not informed", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nickname: true,
        email: true,
        roleCode: true,
        birthdate: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new InternalAppError("User not found", 404);
    }

    return response.json(user);
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      nickname: z
        .string()
        .trim()
        .min(2, { message: "Nickname it's required and it must be at least 2 characters long" })
        .max(30, { message: "Nickname must be at most 30 characters long" }),
      email: z.string().email({ message: "Email is required and must be a valid format up to 100 characters" }),
      password: z
        .string()
        .trim()
        .min(8, { message: "Password it's required and it must be at least 8 characters long" })
        .max(60, { message: "Password must be at most 60 characters long" }),
      birthdate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Birthdate must be in YYYY-MM-DD format" })
        .transform((str) => new Date(str))
        .refine((date) => date <= new Date(), { message: "Birthdate cannot be in the future" }),
    });

    const { nickname, email, password, birthdate } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithSameEmail) throw new InternalAppError("There's already an user with this email");

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        nickname,
        email,
        password: hashedPassword,
        roleCode: 3,
        birthdate,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const bodySchema = z.object({
      nickname: z
        .string()
        .trim()
        .min(2, { message: "Nickname must be at least 2 characters long" })
        .max(30, { message: "Nickname must be at most 30 characters long" })
        .optional(),
      email: z.string().email({ message: "Email must be a valid format" }).optional(),
      password: z
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(60, { message: "Password must be at most 60 characters long" })
        .optional(),
      birthdate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Birthdate must be in YYYY-MM-DD format" })
        .transform((str) => new Date(str))
        .refine((date) => date <= new Date(), { message: "Birthdate cannot be in the future" })
        .optional(),
      roleCode: z.number().int().min(1).max(3).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const loggedUser = request.user;

    if (!loggedUser) {
      throw new InternalAppError("JWT token not found", 401);
    }

    const userToUpdate = await prisma.user.findUnique({ where: { id } });

    if (!userToUpdate) {
      throw new InternalAppError("User not found", 404);
    }

    if (data.roleCode !== undefined) {
      console.log("MEU CARGO ==================== " + loggedUser.roleCode);
      if (data.roleCode === 1 && loggedUser.roleCode !== 1) {
        throw new InternalAppError("Only users with roleCode 1 can assign roleCode 1", 403);
      }

      if (data.roleCode === 2 && loggedUser.roleCode !== 1 && loggedUser.roleCode !== 2) {
        throw new InternalAppError("Only users with roleCode 1 or 2 can assign roleCode 2", 403);
      }
    }

    if (id !== loggedUser.id && loggedUser.roleCode !== 1) {
      throw new InternalAppError("You can only update your own profile", 403);
    }

    if (data.email && data.email !== userToUpdate.email) {
      const userWithSameEmail = await prisma.user.findFirst({ where: { email: data.email } });
      if (userWithSameEmail) {
        throw new InternalAppError("There's already a user with this email");
      }
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hash(data.password, 8);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nickname: true,
        email: true,
        roleCode: true,
        birthdate: true,
        createdAt: true,
      },
    });

    return response.json(updatedUser);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    const loggedUser = request.user;

    if (!loggedUser) {
      throw new InternalAppError("JWT token not found", 401);
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } });

    if (!userToDelete) {
      throw new InternalAppError("User not found", 404);
    }

    // Regra de negócio: só pode deletar se for o próprio usuário ou se for admin (roleCode 1)
    if (id !== loggedUser.id && loggedUser.roleCode !== 1) {
      throw new InternalAppError("You can only delete your own profile or you must be an admin", 403);
    }

    await prisma.user.delete({ where: { id } });

    return response.status(204).send();
  }
}

export { UserController };