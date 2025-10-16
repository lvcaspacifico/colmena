import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class UserProjectController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.number().int().positive({ message: "User ID must be a positive integer" }),
      projectId: z.number().int().positive({ message: "Project ID must be a positive integer" }),
    });

    const { userId, projectId } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new InternalAppError("User not found", 404);
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new InternalAppError("Project not found", 404);
    }

    const existingUserProject = await prisma.userProject.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    if (existingUserProject) {
      throw new InternalAppError("This user is already assigned to this project");
    }

    const userProject = await prisma.userProject.create({
      data: {
        userId,
        projectId,
      },
    });

    return response.status(201).json(userProject);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      userId: z.string().transform((val) => Number(val)),
      projectId: z.string().transform((val) => Number(val)),
    });

    const { userId, projectId } = paramsSchema.parse(request.params);

    const userProjectToDelete = await prisma.userProject.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    if (!userProjectToDelete) {
      throw new InternalAppError("User project association not found", 404);
    }

    await prisma.userProject.delete({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    return response.status(204).send();
  }

  async showByProject(request: Request, response: Response) {
    const paramsSchema = z.object({
      projectId: z.string().transform((val) => Number(val)),
    });

    const { projectId } = paramsSchema.parse(request.params);

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new InternalAppError("Project not found", 404);
    }

    const userProjects = await prisma.userProject.findMany({
      where: { projectId },
      select: {
        userId: true,
        assignedAt: true,
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
            roleCode: true,
          },
        },
      },
      orderBy: {
        assignedAt: "asc",
      },
    });

    return response.json(userProjects);
  }

  async showProjectsByUser(request: Request, response: Response) {
    const paramsSchema = z.object({
      userId: z.string().transform((val) => Number(val)),
    });

    const { userId } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new InternalAppError("User not found", 404);
    }

    const userProjects = await prisma.userProject.findMany({
      where: { userId },
      select: {
        projectId: true,
        assignedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    return response.json(userProjects);
  }
}

export { UserProjectController };