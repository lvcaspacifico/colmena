import { Outlet } from "react-router"; 
import { Navbar } from "../Interface/Navbar";
import { Footer } from "../Interface/Footer";

export function GeneralLayout(){
    return (
            <main className="w-screen min-h-screen flex flex-col">
                <Navbar/>
                <Outlet/>  
                <Footer/> 
            </main>
    )
}