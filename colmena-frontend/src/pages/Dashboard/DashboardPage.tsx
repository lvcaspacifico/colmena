import { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import { GenericBreadCrumb } from "../../components/General/GenericBreadCrumb";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericLink } from "../../components/General/GenericLink";
import debounce from "lodash.debounce";
import { useAuthentication } from "../../hooks/useAuthenticationContext";
import { GenericDashboardKPI } from "../../components/Dashboard/GenericDashboardKPI";
import { GenericDashboardSearchField } from "../../components/Dashboard/GenericDashboardSearchField";
import { GenericDashboardTabManager } from "../../components/Dashboard/GenericDashboardTabManager";
import { GenericDashboardLine } from "../../components/Dashboard/GenericDashboardLine";
import { GenericLoading } from "../../components/General/GenericLoading";

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

type UserProject = {
  projectId: number;
  assignedAt: string;
  project: Project;
};

type Task = {
  id: number;
  projectId: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

type UserTask = {
  taskId: number;
  assignedAt: string;
  task: Task;
};

export function DashboardPage() {
   const { session } = useAuthentication();
  const userId = session?.user.id; 
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [activeTab, setActiveTab] = useState<"shared" | "other">("shared");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handler = debounce(() => setDebouncedSearch(search), 300);
    handler();
    return () => handler.cancel();
  }, [search]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [projectsRes, userProjectsRes, tasksRes, userTasksRes] = await Promise.all([
        api.get<Project[]>("/projects"),
        api.get<UserProject[]>(`/user-project/user/${userId}`),
        api.get<Task[]>("/tasks"),
        api.get<UserTask[]>(`/user-task/user/${userId}`),
      ]);
      setProjects(projectsRes.data);
      setUserProjects(userProjectsRes.data);
      setTasks(tasksRes.data);
      setUserTasks(userTasksRes.data);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredShared = useMemo(() => {
    const projectsFiltered = userProjects
      .map(up => ({ ...up.project, joinedAt: up.assignedAt }))
      .filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const tasksFiltered = userTasks
      .map(ut => ({ ...ut.task, joinedAt: ut.assignedAt }))
      .filter(t => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    return { projects: projectsFiltered, tasks: tasksFiltered };
  }, [userProjects, userTasks, debouncedSearch]);

  const filteredOther = useMemo(() => {
    const sharedProjectIds = userProjects.map(up => up.projectId);
    const sharedTaskIds = userTasks.map(ut => ut.taskId);

    const projectsFiltered = projects
      .filter(p => !sharedProjectIds.includes(p.id) && p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const tasksFiltered = tasks
      .filter(t => !sharedTaskIds.includes(t.id) && t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    return { projects: projectsFiltered, tasks: tasksFiltered };
  }, [projects, tasks, userProjects, userTasks, debouncedSearch]);

  const sharedData = (activeTab === "shared" ? filteredShared : filteredOther);

  return (
    <>
      <GenericBreadCrumb items={[{ type: "text", label: "Dashboard" }]} />
      <div className="p-4">
        <GenericHeaderOne extraClassName="text-start  mb-4" label="Dashboard" />
        <div className="grid grid-cols-4 gap-4">
          <GenericDashboardKPI label="All Projects" kpi={projects.length}/>
          <GenericDashboardKPI label="All Tasks" kpi={tasks.length}/>
          <GenericDashboardKPI label="My Projects" kpi={userProjects.length}/>
          <GenericDashboardKPI label="My Tasks" kpi={userTasks.length}/>
        </div>
        <GenericDashboardSearchField value={search} onChange={(e) => setSearch(e.target.value)} />
        <GenericDashboardTabManager
          tabs={[
            { id: "shared", label: "Shared projects and tasks" },
            { id: "other", label: "Other projects and tasks" },
          ]}
          activeTab={activeTab}
          onClickCustom={setActiveTab}/>

          {isLoading ? <GenericLoading/> : <GenericDashboardLine sharedData={sharedData} />}
        </div>
    </>
  );
}
