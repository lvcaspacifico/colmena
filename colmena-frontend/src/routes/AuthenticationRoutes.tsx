import { Routes, Route } from "react-router";

import { SignInSignUpLayout } from "../components/Layouts/SignInSignUpLayout";
import { SignInPage } from "../pages/User/SignInPage";
import { SignUpPage } from "../pages/User/SignUpPage";
import { NotFoundPage } from "../pages/Generals/NotFoundPage";
import { LandingPage } from "../pages/LandingPage/LandingPage";


export function AuthenticationRoutes(){
    return (
        <Routes>
            <Route path="/" element={<SignInSignUpLayout/>}>
                <Route index element={<LandingPage/>} /> 
                <Route path="/signin" element={<SignInPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Route>
        </Routes>
    )
}