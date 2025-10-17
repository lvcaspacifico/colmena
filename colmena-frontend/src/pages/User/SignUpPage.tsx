import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AxiosError } from "axios";

import { GenericTextInput } from "../../components/Forms/GenericTextInput";
import { GenericButton } from "../../components/Forms/GenericButton";
import { GenericLink } from "../../components/General/GenericLink";
import { GenericDateInput } from "../../components/Forms/GenericDateInput";

import { api } from "../../services/api";

const signUpSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, { message: "Nickname must be at least 2 characters long" })
    .max(30, { message: "Nickname must be at most 30 characters long" }),
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .max(100, { message: "Email must be at most 100 characters long" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(60, { message: "Password must be at most 60 characters long" }),
  confirmPassword: z.string(),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Birthdate must be filled" })
    .refine((date) => new Date(date) <= new Date(), { 
      message: "Birthdate cannot be in the future" 
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched"
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { confirmPassword: _, ...userData } = data;

      const response = await api.post("/users", userData);

      navigate("/signin");

    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", { 
          message: error.response?.data.message || "Could not sign up" 
        });
      } else {
        setError("root", { message: "Could not sign up" });
      }
    }
  };

  const showPasswordFeedback = password.length > 0 && confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword && password.length >= 8;

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black text-center mt-40 mb-2">
        Welcome to <i>Colmena!</i>👋🏻
      </h1>
      <p className="text-lg text-black text-center">Sign up to start collaborating</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col my-6">
        <GenericTextInput
          {...register("nickname")}
          legend="Enter a nickname"
          type="text"
          placeholder="your.nick"
        />
        {errors.nickname && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.nickname.message}.
          </p>
        )}
        <GenericTextInput
          {...register("email")}
          legend="Enter an email"
          type="email"
          placeholder="enteryour@email.com"
        />
        {errors.email && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.email.message}.
          </p>
        )}
        <GenericTextInput
          {...register("password")}
          legend="Enter a password"
          type="password"
          placeholder="Password12345"
        />
        {errors.password && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.password.message}.
          </p>
        )}
        <GenericTextInput
          {...register("confirmPassword")}
          legend="Confirm password"
          type="password"
          placeholder="Password12345"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.confirmPassword.message}.
          </p>
        )}
        {showPasswordFeedback && !errors.confirmPassword && (
          <p className={`text-xs text-center mb-2 font-bold ${
            passwordsMatch ? "text-green-500" : "text-yellow-500"
          }`}>
            {passwordsMatch ? "" : "Passwords must match."}
          </p>
        )}

        <GenericDateInput
          {...register("birthdate")}
          legend="Enter your birthdate"
        />
        {errors.birthdate && (
          <p className="text-xs text-center text-red-500 font-semibold mt-1 mb-2">
            {errors.birthdate.message}
          </p>
        )}

        <GenericButton isLoading={isSubmitting} type="submit">
          Sign up
        </GenericButton>
        
        <GenericLink to="/signin" label="Already have an account? Sign in" />
      </form>
      {errors.root && (
        <p className="text-sm text-red-500 text-center font-bold mt-2">
          ⚠️ {errors.root.message}
        </p>
      )}
    </div>
  );
}