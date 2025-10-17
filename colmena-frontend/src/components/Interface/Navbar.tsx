import colmenaIconSVG from "../../assets/brand-assets/colmena-icon.svg";
import { useAuthentication } from "../../hooks/useAuthenticationContext";

export function Navbar(){
    const { session } = useAuthentication();

    return (
            <nav className="bg-black p-4 flex flex-row justify-between items-center">
                <img className="w-8 h-8" src={colmenaIconSVG} alt="Colmena's logo"/>
                <p className="align-self-end font-regular text-white">Olá, <strong>{session?.user.nickname}</strong>!👋🏻</p>
            </nav> 
    )
}