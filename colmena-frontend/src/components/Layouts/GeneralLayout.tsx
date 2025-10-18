import { Outlet } from "react-router"; 
import { Navbar } from "../Interface/Navbar";
import { Footer } from "../Interface/Footer";

export function GeneralLayout(){
    return ( 
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar/>
                <Outlet/>  
                <Footer/> 
            </main>
    )
}