import { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import { GenericBreadCrumb } from "../../components/General/GenericBreadCrumb";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericLink } from "../../components/General/GenericLink";
import debounce from "lodash.debounce";
import { useAuthentication } from "../../hooks/useAuthenticationContext";

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

  function renderItem(item: Project | Task, type: "project" | "task", joinedAt?: string) {
    const name = type === "project" ? (item as Project).name : (item as Task).title;
    const createdAt = item.createdAt;
    return (
      <li key={`${type}-${item.id}`} className="flex justify-between items-center bg-black/20 p-3 rounded mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-gray-500 text-white w-10 h-10 flex items-center justify-center rounded">
            {name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <GenericLink
              label={name}
              to={type === "project" ? `/projects/project-details/${item.id}` : `/tasks/task-details/${item.id}`}
              className="text-white font-semibold"
            />
            <span className="text-gray-300 text-sm">{type}</span>
          </div>
        </div>
        <div className="text-gray-300 text-sm text-right">
          <div>{new Date(createdAt).toLocaleDateString()}</div>
          {joinedAt && <div>Joined at: {new Date(joinedAt).toLocaleDateString()}</div>}
        </div>
      </li>
    );
  }

  const sharedData = activeTab === "shared" ? filteredShared : filteredOther;
  const otherData = activeTab === "shared" ? filteredOther : filteredShared;

  return (
    <>
      <GenericBreadCrumb items={[{ type: "text", label: "Dashboard" }]} />
      <div className="p-4">
        <GenericHeaderOne label="Dashboard" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-600 p-4 rounded text-white">
            <div>Total Projects</div>
            <div className="text-2xl font-bold">{projects.length}</div>
          </div>
          <div className="bg-green-600 p-4 rounded text-white">
            <div>Total My Projects</div>
            <div className="text-2xl font-bold">{userProjects.length}</div>
          </div>
          <div className="bg-purple-600 p-4 rounded text-white">
            <div>Total Tasks</div>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </div>
          <div className="bg-yellow-600 p-4 rounded text-white">
            <div>Total My Tasks</div>
            <div className="text-2xl font-bold">{userTasks.length}</div>
          </div>
        </div>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Search projects and tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border w-full mb-4"
          />
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab("shared")}
              className={`px-4 py-2 rounded ${activeTab === "shared" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            >
              Shared projects and tasks
            </button>
            <button
              onClick={() => setActiveTab("other")}
              className={`px-4 py-2 rounded ${activeTab === "other" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            >
              Other projects and tasks
            </button>
          </div>
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : (
            <ul>
              {sharedData.projects.map(p => renderItem(p, "project", p.createdAt))}
              {sharedData.tasks.map(t => renderItem(t, "task", t.createdAt))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
