import colmenaIconSVG from "../../assets/brand-assets/colmena-icon.svg";
import { useAuthentication } from "../../hooks/useAuthenticationContext";
import { GenericLink } from "../General/GenericLink";

export function Navbar(){
    const { session, remove } = useAuthentication();
    let showLoggedOptions = false;
    if(session?.user){
        showLoggedOptions = true;
    }
    
    return (
            <nav className="bg-black p-4 flex flex-row justify-between items-center">
                <img className="w-8 h-8" src={colmenaIconSVG} alt="Colmena's logo"/>
                {showLoggedOptions &&
                    <ul className="flex flex-row gap-2">
                    <li className="align-self-end font-regular text-white">Hello, <strong>{session?.user.nickname}</strong>!👋🏻</li>
                    <li className="font-regular text-white">|</li>
                    <li><GenericLink className="hover:text-blue-600" label="Sign out" navigationFunction={remove}/></li>
                    </ul> 
                }
            </nav> 
    )
}