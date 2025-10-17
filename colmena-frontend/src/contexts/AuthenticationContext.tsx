import { createContext, type ReactElement, type ReactNode} from "react";
import { useState, useEffect } from "react";
import { api } from "../services/api";

type AuthenticationContext = {
    isLoading: boolean
    session: null | UserAPIResponse
    save: (data: UserAPIResponse) => void
    remove: () => void
}

const LOCAL_STORAGE_KEY = "@colmena";

export const AuthenticationContext = createContext({} as AuthenticationContext);

export function AuthenticationProvider({ children } : { children: ReactNode }){

    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<null | UserAPIResponse>(null);

    function save(data: UserAPIResponse){
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user))
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token)
        
        setSession(data);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    } 

    function loadUser(){
        const user = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`)
        const token = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`)

        if(token && user){
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            setSession({
                token, 
                user: JSON.parse(user)
            })
        }
    }

    function remove(){
        setSession(null);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`)
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`)

        window.location.assign("/");
    }

    useEffect(()=>{
        loadUser();
        setIsLoading(false);
    }, [])

    return (
            <AuthenticationContext.Provider value={{ session, save, remove, isLoading }}>
                {children}
            </AuthenticationContext.Provider>
    )
}