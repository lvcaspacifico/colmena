import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class ProjectController {
  async index(request: Request, response: Response) {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(projects);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });

    if (!project) {
      throw new InternalAppError("Project not found", 404);
    }

    return response.json(project);
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(2, { message: "Name is required and must be at least 2 characters long" })
        .max(100, { message: "Name must be at most 100 characters long" }),
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

    const { name, startDate, endDate } = bodySchema.parse(request.body);

    if (endDate && endDate < startDate) {
      throw new InternalAppError("End date cannot be before start date");
    }

    const project = await prisma.project.create({
      data: {
        name,
        startDate,
        endDate,
      },
    });

    return response.status(201).json(project);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(100, { message: "Name must be at most 100 characters long" })
        .optional(),
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

    const projectToUpdate = await prisma.project.findUnique({ where: { id } });

    if (!projectToUpdate) {
      throw new InternalAppError("Project not found", 404);
    }

    const finalStartDate = data.startDate ?? projectToUpdate.startDate;
    const finalEndDate = data.endDate !== undefined ? data.endDate : projectToUpdate.endDate;

    if (finalEndDate && finalEndDate < finalStartDate) {
      throw new InternalAppError("End date cannot be before start date");
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate !== undefined ? data.endDate : undefined,
      },
    });

    return response.json(updatedProject);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    const projectToDelete = await prisma.project.findUnique({ where: { id } });

    if (!projectToDelete) {
      throw new InternalAppError("Project not found", 404);
    }

    await prisma.project.delete({ where: { id } });

    return response.status(204).send();
  }
}

export { ProjectController };