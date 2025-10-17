import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";

import { api } from "../../services/api";
import { useAuthentication } from "../../hooks/useAuthenticationContext";

import { GenericTextInput } from "../../components/Forms/GenericTextInput";
import { GenericButton } from "../../components/Forms/GenericButton";
import { GenericLink } from "../../components/General/GenericLink";

const signInScheme = z.object({
    email: z.email({message: "Inform a valid email"}),
    password: z.string().trim().min(6, { message: "Inform a valid password" })
})

export function SignInPage(){
    const [state, formAction, isLoading] = useActionState(signIn, null);
    const auth = useAuthentication();
    const navigate = useNavigate();

    async function signIn(_: any, formData: FormData){
        try {
            const data = signInScheme.parse({
            email: formData.get("email"),
            password: formData.get("password")
            }) 
            const response = await api.post("/sessions", data);
            console.log(response.data);
            auth.save(response.data);
            navigate("/");

        } catch (error) {
            if(error instanceof ZodError){
                return { message: error.issues[0].message } 
            }
            if(error instanceof AxiosError){
                return { message: error.response?.data.message } 
            }
            return { message: "Não foi possível cadastrar" } 
        } 
    }

    return (
    <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-black text-center mt-40 mb-2">Welcome back<br />to <i>Colmena!</i>👋🏻</h1>
        <p className="text-lg text-black text-center">Sign in to keep colaborating</p>
        <form action={formAction} className=" flex flex-col my-6">
            <GenericTextInput
                legend="Enter your email"
                type="email"
                required
                name="email"
                placeholder="enteryour@email.com"/> 
            <GenericTextInput
                legend="Enter your password"
                type="password"
                required
                name="password"
                placeholder="Password12345"/> 

            
            <GenericButton isLoading={isLoading} type="submit">Sign in</GenericButton>
            <GenericLink to="/signup" label="Don't have an account? Sign up"/>
        </form>

        {state?.message && (
            <p className="text-sm text-red-500 text-center font-bold mt-2">⚠️{state.message}.</p>
        )}
    </div>
    )
}