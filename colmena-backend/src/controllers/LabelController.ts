import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class LabelController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      type: z.string().transform((val) => Number(val)).optional(),
    });

    const { type } = querySchema.parse(request.query);

    const labels = await prisma.label.findMany({
      where: type ? { type } : undefined,
      select: {
        id: true,
        type: true,
        name: true,
        color: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return response.json(labels);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    const label = await prisma.label.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        name: true,
        color: true,
      },
    });

    if (!label) {
      throw new InternalAppError("Label not found", 404);
    }

    return response.json(label);
  }

    async showForProject(request: Request, response: Response) {
        const labels = await prisma.label.findMany({
            where: { type: { in: [1, 2] } },
            select: {
            id: true,
            type: true,
            name: true,
            color: true,
            },
            orderBy: {
            name: "asc",
            },
        });

        return response.json(labels);
    }

    async showForTask(request: Request, response: Response) {
        const labels = await prisma.label.findMany({
            where: { type: { in: [1, 3] } },
            select: {
            id: true,
            type: true,
            name: true,
            color: true,
            },
            orderBy: {
            name: "asc",
            },
        });

        return response.json(labels);
    }


  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      type: z
        .number()
        .int()
        .min(1, { message: "Type must be 1 (Global), 2 (Project), or 3 (Task)" })
        .max(3, { message: "Type must be 1 (Global), 2 (Project), or 3 (Task)" }),
      name: z
        .string()
        .trim()
        .min(1, { message: "Name is required and must be at least 1 character long" })
        .max(30, { message: "Name must be at most 30 characters long" }),
      color: z
        .string()
        .trim()
        .regex(/^#[0-9A-Fa-f]{6}$/, { message: "Color must be in hex format (#RRGGBB)" })
        .length(7, { message: "Color must be exactly 7 characters (#RRGGBB)" }),
    });

    const { type, name, color } = bodySchema.parse(request.body);

    const label = await prisma.label.create({
      data: {
        type,
        name,
        color: color.toUpperCase(),
      },
    });

    return response.status(201).json(label);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const bodySchema = z.object({
      type: z
        .number()
        .int()
        .min(1, { message: "Type must be 1 (Global), 2 (Project), or 3 (Task)" })
        .max(3, { message: "Type must be 1 (Global), 2 (Project), or 3 (Task)" })
        .optional(),
      name: z
        .string()
        .trim()
        .min(1, { message: "Name must be at least 1 character long" })
        .max(30, { message: "Name must be at most 30 characters long" })
        .optional(),
      color: z
        .string()
        .trim()
        .regex(/^#[0-9A-Fa-f]{6}$/, { message: "Color must be in hex format (#RRGGBB)" })
        .length(7, { message: "Color must be exactly 7 characters (#RRGGBB)" })
        .optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const labelToUpdate = await prisma.label.findUnique({ where: { id } });

    if (!labelToUpdate) {
      throw new InternalAppError("Label not found", 404);
    }

    const updatedLabel = await prisma.label.update({
      where: { id },
      data: {
        type: data.type,
        name: data.name,
        color: data.color ? data.color.toUpperCase() : undefined,
      },
    });

    return response.json(updatedLabel);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().transform((val) => Number(val)),
    });

    const { id } = paramsSchema.parse(request.params);

    const labelToDelete = await prisma.label.findUnique({ where: { id } });

    if (!labelToDelete) {
      throw new InternalAppError("Label not found", 404);
    }

    await prisma.label.delete({ where: { id } });

    return response.status(204).send();
  }
}

export { LabelController };