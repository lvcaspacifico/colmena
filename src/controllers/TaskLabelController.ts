import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TaskLabelController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      taskId: z.number().int().positive({ message: "Task ID must be a positive integer" }),
      labelId: z.number().int().positive({ message: "Label ID must be a positive integer" }),
    });

    const { taskId, labelId } = bodySchema.parse(request.body);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new InternalAppError("Task not found", 404);
    }

    const label = await prisma.label.findUnique({ where: { id: labelId } });
    if (!label) {
      throw new InternalAppError("Label not found", 404);
    }

    const existingTaskLabel = await prisma.taskLabel.findUnique({
      where: {
        taskId_labelId: { taskId, labelId },
      },
    });

    if (existingTaskLabel) {
      throw new InternalAppError("This label is already assigned to this task");
    }

    const taskLabel = await prisma.taskLabel.create({
      data: {
        taskId,
        labelId,
      },
    });

    return response.status(201).json(taskLabel);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.string().transform((val) => Number(val)),
      labelId: z.string().transform((val) => Number(val)),
    });

    const { taskId, labelId } = paramsSchema.parse(request.params);

    const taskLabelToDelete = await prisma.taskLabel.findUnique({
      where: {
        taskId_labelId: { taskId, labelId },
      },
    });

    if (!taskLabelToDelete) {
      throw new InternalAppError("Task label association not found", 404);
    }

    await prisma.taskLabel.delete({
      where: {
        taskId_labelId: { taskId, labelId },
      },
    });

    return response.status(204).send();
  }
}

export { TaskLabelController };