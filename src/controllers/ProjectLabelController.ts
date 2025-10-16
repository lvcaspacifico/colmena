import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { EntityIdMessage } from "@/utils/Enums/Validation/EntityIdMessage";
import { z } from "zod";

class ProjectLabelController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      projectId: z.number().int().positive({ message: "Project ID must be a positive integer" }),
      labelId: z.number().int().positive({ message: "Label ID must be a positive integer" }),
    });

    const { projectId, labelId } = bodySchema.parse(request.body);

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new InternalAppError("Project not found", 404);
    }

    const label = await prisma.label.findUnique({ where: { id: labelId } });
    if (!label) {
      throw new InternalAppError("Label not found", 404);
    }

    const existingProjectLabel = await prisma.projectLabel.findUnique({
      where: {
        projectId_labelId: { projectId, labelId },
      },
    });

    if (existingProjectLabel) {
      throw new InternalAppError("This label is already assigned to this project");
    }

    const projectLabel = await prisma.projectLabel.create({
      data: {
        projectId,
        labelId,
      },
    });

    return response.status(201).json(projectLabel);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      projectId: z.string().transform((val) => Number(val)),
      labelId: z.string().transform((val) => Number(val)),
    });

    const { projectId, labelId } = paramsSchema.parse(request.params);

    const projectLabelToDelete = await prisma.projectLabel.findUnique({
      where: {
        projectId_labelId: { projectId, labelId },
      },
    });

    if (!projectLabelToDelete) {
      throw new InternalAppError("Project label association not found", 404);
    }

    await prisma.projectLabel.delete({
      where: {
        projectId_labelId: { projectId, labelId },
      },
    });

    return response.status(204).send();
  }

  async showByProject(request: Request, response: Response){

    const requestParams = z.object({
      id: z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, { message: EntityIdMessage.MISSING_OR_NAN})
    })

    const { id } = requestParams.parse(request.params);

    const labels = await prisma.projectLabel.findMany({
      where: { projectId: id },
      include: {
        label: {
          select: {
            name: true,
            color: true
          }
        }
      }
    })

    return response.status(200).json(labels);
  }
}

export { ProjectLabelController };