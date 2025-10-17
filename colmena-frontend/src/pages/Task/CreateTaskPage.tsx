import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";

import { GenericTextInput } from "../../components/Forms/GenericTextInput";
import { GenericDateInput } from "../../components/Forms/GenericDateInput";
import { GenericButton } from "../../components/Forms/GenericButton";
import { GenericLink } from "../../components/General/GenericLink";

import { api } from "../../services/api";

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
};

const createTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, { message: "Title must be at least 2 characters long" })
      .max(200, { message: "Title must be at most 200 characters long" }),
    content: z
      .string()
      .trim()
      .min(2, { message: "Content must be at least 2 characters long" }),
    projectId: z
        .union([z.number(), z.null()])
        .nullable()
        .transform((val) => (val === null ? null : val)),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Start date must be filled" }),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "End date must be filled" })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    { message: "End date cannot be before start date", path: ["endDate"] }
  );

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export function CreateTaskPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    mode: "onTouched",
    defaultValues: {
      projectId: null,
    },
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get<Project[]>("/projects");
        setProjects(response.data);
      } catch {
        setErrorMessage("Unable to load projects");
      } finally {
        setIsLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        projectId: data.projectId || null,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
      };

      await api.post("/tasks", payload);
      navigate("/tasks");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          message: error.response?.data.message || "Could not create task",
        });
      } else {
        setError("root", { message: "Could not create task" });
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black text-center mt-20 mb-2">
        Create Task
      </h1>
      <p className="text-lg text-black text-center">
        Fill out the details below to create a new task
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col my-6 w-full max-w-md">
        <GenericTextInput
          {...register("title")}
          legend="Task Title"
          type="text"
          placeholder="e.g. Fix login bug"
        />
        {errors.title && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.title.message}.
          </p>
        )}

        <GenericTextInput
          {...register("content")}
          legend="Task Content"
          type="text"
          placeholder="e.g. Details about the task"
        />
        {errors.content && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.content.message}.
          </p>
        )}

        <label className="text-black font-medium mt-2 mb-1">Project (optional)</label>
        {isLoadingProjects ? (
          <p className="text-black mb-2">Loading projects...</p>
        ) : errorMessage ? (
          <p className="text-red-500 text-sm mb-2">⚠️ {errorMessage}</p>
        ) : (
          <select
            {...register("projectId", {
              setValueAs: (v) => (v === "" ? null : Number(v))
            })}
            className="w-full px-3 py-2 rounded mb-2 border border-gray-300"
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}

        <GenericDateInput {...register("startDate")} legend="Start Date" />
        {errors.startDate && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.startDate.message}.
          </p>
        )}

        <GenericDateInput {...register("endDate")} legend="End Date (optional)" />
        {errors.endDate && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.endDate.message}.
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <GenericButton isLoading={isSubmitting} type="submit">
            Save
          </GenericButton>
          <GenericLink to="/tasks" label="← Cancel" className="px-4 py-2" />
        </div>
      </form>

      {errors.root && (
        <p className="text-sm text-red-500 text-center font-bold mt-2">
          ⚠️ {errors.root.message}
        </p>
      )}
    </div>
  );
}
