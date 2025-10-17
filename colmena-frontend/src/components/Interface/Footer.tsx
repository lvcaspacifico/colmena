import { useAuthentication } from "../../hooks/useAuthenticationContext";
import { GenericLink } from "../General/GenericLink";

export function Footer(){
    const { session } = useAuthentication();
    let showLoggedOptions = false;
    if(session?.user){
        showLoggedOptions = true;
    }
    const { remove } = useAuthentication();
    return (
            <footer className="w-full flex flex-row min-h-16 mt-auto justify-center items-center bg-colmena-orange">
                 <ul className="flex flex-col gap-2 justify-center items center text-center">
                    <li className="mt-4 text-sm">Feito com ☕ por <GenericLink className="text-white no-underline  hover:text-blue-600 hover:underline" label="@lvcaspacifico" to="https://github.com/lvcaspacifico"/></li>

                     {showLoggedOptions && <li className="mb-4"><GenericLink className="hover:text-blue-600" label="Sign out" navigationFunction={remove}/></li>}
                 </ul>
            </footer>
    )
}