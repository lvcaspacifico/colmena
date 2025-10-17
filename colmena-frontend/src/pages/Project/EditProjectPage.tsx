import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";

import { GenericTextInput } from "../../components/Forms/GenericTextInput";
import { GenericDateInput } from "../../components/Forms/GenericDateInput";
import { GenericButton } from "../../components/Forms/GenericButton";
import { GenericLink } from "../../components/General/GenericLink";

import { api } from "../../services/api";

const editProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(100, { message: "Name must be at most 100 characters long" }),
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

type EditProjectFormData = z.infer<typeof editProjectSchema>;

export function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await api.get(`/projects/project/${id}`);
        const project = response.data;
        reset({
          name: project.name,
          startDate: project.startDate.split("T")[0],
          endDate: project.endDate ? project.endDate.split("T")[0] : "",
        });
      } catch {
        setErrorMessage("Unable to load project.");
      } finally {
        setIsLoadingProject(false);
      }
    }
    fetchProject();
  }, [id, reset]);

  const onSubmit = async (data: EditProjectFormData) => {
    try {
      const payload = {
        ...data,
        endDate: data.endDate || undefined,
      };

      await api.put(`/projects/${id}`, payload); 
      navigate(`/projects/project-details/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          message: error.response?.data.message || "Could not update project",
        });
      } else {
        setError("root", { message: "Could not update project" });
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch {
      setError("root", { message: "Unable to delete project" });
    }
  };

  if (isLoadingProject) {
    return <p className="text-black mt-4 text-center">Loading project...</p>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black text-center mt-20 mb-2">
        Edit Project
      </h1>
      <p className="text-lg text-black text-center">
        Update the project details below
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center my-6 w-full max-w-md">
        <GenericTextInput
          {...register("name")}
          legend="Project name"
          type="text"
          placeholder="e.g. Community Garden"
        />
        {errors.name && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.name.message}.
          </p>
        )}

        <GenericDateInput {...register("startDate")} legend="Start date" />
        {errors.startDate && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.startDate.message}.
          </p>
        )}

        <GenericDateInput {...register("endDate")} legend="End date (optional)" />
        {errors.endDate && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.endDate.message}.
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <GenericButton isLoading={isSubmitting} type="submit" extraClassName="bg-green-600 hover:bg-green-700 max-w-35">
            Save
          </GenericButton>
          <GenericButton
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 max-w-35"
          >
            Delete
          </GenericButton>
        </div>

        <GenericLink to={`/projects/project-details/${id}`} label="← Back to project details" />
      </form>

      {errors.root && (
        <p className="text-sm text-red-500 text-center font-bold mt-2">
          ⚠️ {errors.root.message}
        </p>
      )}
    </div>
  );
}
