import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class UserTaskController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.number().int().positive({ message: "User ID must be a positive integer" }),
      taskId: z.number().int().positive({ message: "Task ID must be a positive integer" }),
    });

    const { userId, taskId } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new InternalAppError("User not found", 404);
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new InternalAppError("Task not found", 404);
    }

    const existingUserTask = await prisma.userTask.findUnique({
      where: {
        userId_taskId: { userId, taskId },
      },
    });

    if (existingUserTask) {
      throw new InternalAppError("This user is already assigned to this task");
    }

    const userTask = await prisma.userTask.create({
      data: {
        userId,
        taskId,
      },
    });

    return response.status(201).json(userTask);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      userId: z.string().transform((val) => Number(val)),
      taskId: z.string().transform((val) => Number(val)),
    });

    const { userId, taskId } = paramsSchema.parse(request.params);

    const userTaskToDelete = await prisma.userTask.findUnique({
      where: {
        userId_taskId: { userId, taskId },
      },
    });

    if (!userTaskToDelete) {
      throw new InternalAppError("User task association not found", 404);
    }

    await prisma.userTask.delete({
      where: {
        userId_taskId: { userId, taskId },
      },
    });

    return response.status(204).send();
  }

  async showByTask(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.string().transform((val) => Number(val)),
    });

    const { taskId } = paramsSchema.parse(request.params);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new InternalAppError("Task not found", 404);
    }

    const userTasks = await prisma.userTask.findMany({
      where: { taskId },
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

    return response.json(userTasks);
  }

  async showTasksByUser(request: Request, response: Response) {
    const paramsSchema = z.object({
      userId: z.string().transform((val) => Number(val)),
    });

    const { userId } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new InternalAppError("User not found", 404);
    }

    const userTasks = await prisma.userTask.findMany({
      where: { userId },
      select: {
        taskId: true,
        assignedAt: true,
        task: {
          select: {
            id: true,
            projectId: true,
            title: true,
            content: true,
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

    return response.json(userTasks);
  }
}

export { UserTaskController };