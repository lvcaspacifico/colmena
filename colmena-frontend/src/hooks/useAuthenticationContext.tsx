import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { useContext } from "react";

export function useAuthentication(){
    const context = useContext(AuthenticationContext);
    return context;
}

