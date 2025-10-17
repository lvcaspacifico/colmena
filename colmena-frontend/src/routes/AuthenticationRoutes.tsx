import { Routes, Route } from "react-router";

import { SignInPage } from "../pages/User/SignInPage";
import { SignUpPage } from "../pages/User/SignUpPage";
import { NotFoundPage } from "../pages/Generals/NotFoundPage";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { GeneralLayout } from "../components/Layouts/GeneralLayout";
import { MVPLandingPage } from "../pages/LandingPage/MVPLandingPage";


export function AuthenticationRoutes(){
    return (
        <Routes>
            <Route path="/" element={<GeneralLayout/>}>
                <Route index element={<LandingPage/>} /> 
                <Route path="/signin" element={<SignInPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                
                <Route path="mvp" element={<MVPLandingPage/>}/>
                
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Route>
        </Routes>
    )
}