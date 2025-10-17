import { Routes, Route } from "react-router";

import { NotFoundPage } from "../pages/Generals/NotFoundPage";
import { GeneralLayout } from "../components/Layouts/GeneralLayout";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { ProjectRoutes } from "./ProjectRoutes";
import { TaskRoutes } from "./TaskRoutes";
import { LabelRoutes } from "./LabelRoutes";


export function HasRoleCodeRoutes(){
    return (
        <Routes>
            <Route path="/" element={<GeneralLayout/>}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage/>}/>
                <Route path="projects/*" element={<ProjectRoutes/>}/>
                <Route path="tasks/*" element={<TaskRoutes/>}/>
                <Route path="labels/*" element={<LabelRoutes/>}/>
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Route>
        </Routes>
    )
}