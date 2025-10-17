import { Routes, Route } from "react-router";

import { NotFoundPage } from "../pages/Generals/NotFoundPage";
import { GeneralLayout } from "../components/Layouts/GeneralLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { ProjectRoutes } from "./ProjectRoutes";
import { TaskRoutes } from "./TaskRoutes";


export function HasRoleCodeRoutes(){
    return (
        <Routes>
            <Route path="/" element={<GeneralLayout/>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="projects/*" element={<ProjectRoutes/>}/>
                <Route path="tasks/*" element={<TaskRoutes/>}/>
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Route>
        </Routes>
    )
}