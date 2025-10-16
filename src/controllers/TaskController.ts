import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TaskController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      projectId: z.string().transform((val) => Number(val)).optional(),
    });

    const { projectId } = querySchema.parse(request.query);

    const tasks = await prisma.task.findMany({
      where: projectId ? { projectId } : undefined,
      select: {
        id: true,
        projectId: true,
        title: true,
        content: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(tasks);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        projectId: true,
        title: true,
        content: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });

    if (!task) {
      throw new InternalAppError("Task not found", 404);
    }

    return response.json(task);
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      projectId: z.number().int().positive().optional().nullable(),
      title: z
        .string()
        .trim()
        .min(1, { message: "Title is required and must be at least 1 character long" })
        .max(80, { message: "Title must be at most 80 characters long" }),
      content: z.string().min(1, { message: "Content is required" }),
      startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Start date must be in YYYY-MM-DD format" })
        .transform((str) => new Date(str)),
      endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "End date must be in YYYY-MM-DD format" })
        .transform((str) => new Date(str))
        .optional(),
    });

    const { projectId, title, content, startDate, endDate } = bodySchema.parse(request.body);

    if (projectId) {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) {
        throw new InternalAppError("Project not found", 404);
      }
    }

    if (endDate && endDate < startDate) {
      throw new InternalAppError("End date cannot be before start date");
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        content,
        startDate,
        endDate,
      },
    });

    return response.status(201).json(task);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const bodySchema = z.object({
      projectId: z.number().int().positive().optional().nullable(),
      title: z
        .string()
        .trim()
        .min(1, { message: "Title must be at least 1 character long" })
        .max(80, { message: "Title must be at most 80 characters long" })
        .optional(),
      content: z.string().min(1, { message: "Content cannot be empty" }).optional(),
      startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Start date must be in YYYY-MM-DD format" })
        .transform((str) => new Date(str))
        .optional(),
      endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "End date must be in YYYY-MM-DD format" })
        .transform((str) => new Date(str))
        .optional()
        .nullable(),
    });

    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const taskToUpdate = await prisma.task.findUnique({ where: { id } });

    if (!taskToUpdate) {
      throw new InternalAppError("Task not found", 404);
    }

    if (data.projectId !== undefined && data.projectId !== null) {
      const project = await prisma.project.findUnique({ where: { id: data.projectId } });
      if (!project) {
        throw new InternalAppError("Project not found", 404);
      }
    }

    const finalStartDate = data.startDate ?? taskToUpdate.startDate;
    const finalEndDate = data.endDate !== undefined ? data.endDate : taskToUpdate.endDate;

    if (finalEndDate && finalEndDate < finalStartDate) {
      throw new InternalAppError("End date cannot be before start date");
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        projectId: data.projectId !== undefined ? data.projectId : undefined,
        title: data.title,
        content: data.content,
        startDate: data.startDate,
        endDate: data.endDate !== undefined ? data.endDate : undefined,
      },
    });

    return response.json(updatedTask);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    const taskToDelete = await prisma.task.findUnique({ where: { id } });

    if (!taskToDelete) {
      throw new InternalAppError("Task not found", 404);
    }

    await prisma.task.delete({ where: { id } });

    return response.status(204).send();
  }
}

export { TaskController };