import { Outlet } from "react-router";
import colmenaIconSVG from "../../assets/brand-assets/colmena-icon.svg";
import { Footer } from "../Interface/Footer";


export function SignInSignUpLayout(){
    return (
            <main className="w-screen min-h-screen flex flex-col">
                <nav className="bg-black p-4">
                    <img className="w-8 h-8" src={colmenaIconSVG} alt="Colmena's logo"/>
                </nav> 
                <Outlet/>    
                <Footer/> 
            </main>
    )
}