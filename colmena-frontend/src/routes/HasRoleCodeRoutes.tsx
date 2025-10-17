import { Routes, Route } from "react-router";

import { NotFoundPage } from "../pages/Generals/NotFoundPage";
import { GeneralLayout } from "../components/Layouts/GeneralLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";


export function HasRoleCodeRoutes(){
    return (
        <Routes>
            <Route path="/" element={<GeneralLayout/>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Route>
        </Routes>
    )
}