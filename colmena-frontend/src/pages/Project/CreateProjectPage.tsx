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

const createProjectSchema = z
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

type CreateProjectFormData = z.infer<typeof createProjectSchema>;


export function CreateProjectPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const payload = {
        ...data,
        endDate: data.endDate || undefined,
      };

      await api.post("/projects", payload);

      navigate("/projects");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          message: error.response?.data.message || "Could not create project",
        });
      } else {
        setError("root", { message: "Could not create project" });
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black text-center mt-20 mb-2">
        Create a New Project
      </h1>
      <p className="text-lg text-black text-center">
        Fill out the details below to start a new project
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col my-6">
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

        <GenericDateInput
          {...register("startDate")}
          legend="Start date"
        />
        {errors.startDate && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.startDate.message}.
          </p>
        )}

        <GenericDateInput
          {...register("endDate")}
          legend="End date (optional)"
        />
        {errors.endDate && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.endDate.message}.
          </p>
        )}

        <GenericButton isLoading={isSubmitting} type="submit">
          Create Project
        </GenericButton>

        <GenericLink to="/projects" label="← Back to projects list" />
      </form>

      {errors.root && (
        <p className="text-sm text-red-500 text-center font-bold mt-2">
          ⚠️ {errors.root.message}
        </p>
      )}
    </div>
  );
}
