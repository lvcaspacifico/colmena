import { BrowserRouter } from "react-router";
import { AuthenticationRoutes } from "./AuthenticationRoutes";
import { HasRoleCodeRoutes } from "./HasRoleCodeRoutes"; 
import { useAuthentication } from "../hooks/useAuthenticationContext";
import { GenericLoading } from "../components/Loadings/GenericLoading";

export function IndexRoutes(){  
    const { session , isLoading } = useAuthentication() 

    function Route(){
        switch(session?.user.roleCode){
            case 1:
                case 2:
                    case 3: 
                    console.log("Falled into <HasRoleCodeRoutes/>")
                    return <HasRoleCodeRoutes/>
            default:
                console.log("Falled into <AuthenticationRoutes/>")
                return <AuthenticationRoutes/>
        }
    }
    if(isLoading){
        return <GenericLoading/>
    }

    return (
        <BrowserRouter> 
            { Route() }
        </BrowserRouter>
    )
}