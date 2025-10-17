import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { api } from "../../services/api";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericButton } from "../../components/Forms/GenericButton"
import { GenericBreadCrumb } from "../../components/General/GenericBreadCrumb";
import { formatDateTimeString } from "../../utils/String/formatDateTimeString";

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
};

type ProjectLabel = {
  projectId: number;
  labelId: number;
  label: {
    name: string;
    color: string;
  };
};

type Label = {
  id: number;
  type: number;
  name: string;
  color: string;
};

type ProjectUser = {
  userId: number;
  assignedAt: string;
  user: {
    id: number;
    nickname: string;
    email: string;
    roleCode: number;
  };
};

type User = {
  id: number;
  nickname: string;
  email: string;
  roleCode: number;
  birthdate: string;
  createdAt: string;
};

type Task = {
  id: number;
  projectId: number | null;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

type TabType = "tasks" | "labels" | "users";

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  
  const [projectLabels, setProjectLabels] = useState<ProjectLabel[]>([]);
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await api.get<Project>(`/projects/project/${id}`);
        setProject(response.data);
      } catch {
        setErrorMessage("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (activeTab === "labels" && id) {
      fetchProjectLabels();
    } else if (activeTab === "users" && id) {
      fetchProjectUsers();
    } else if (activeTab === "tasks" && id) {
      fetchProjectTasks();
    }
  }, [activeTab, id]);

  async function fetchProjectLabels() {
    setLabelsLoading(true);
    try {
      const response = await api.get<ProjectLabel[]>(`/project-label/project/${id}`);
      setProjectLabels(response.data);
    } catch {
      setErrorMessage("Error loading project labels");
    } finally {
      setLabelsLoading(false);
    }
  }

  async function fetchAvailableLabels() {
    try {
      const response = await api.get<Label[]>("/labels/project");
      setAvailableLabels(response.data);
    } catch {
      setErrorMessage("Error loading available labels");
    }
  }

  async function addLabelToProject(labelId: number) {
    try {
      await api.post("/project-label", {
        projectId: Number(id),
        labelId: labelId,
      });
      await fetchProjectLabels();
      setShowAddLabel(false);
    } catch {
      setErrorMessage("Error adding label to project");
    }
  }

  function navigateToEditPage(){
    navigate(`/projects/edit-project/${id}`)
  }

  async function removeLabelFromProject(labelId: number) {
    try {
      await api.delete(`/project-label/${id}/${labelId}`);
      await fetchProjectLabels();
    } catch {
      setErrorMessage("Error removing label from project");
    }
  }

  async function fetchProjectUsers() {
    setUsersLoading(true);
    try {
      const response = await api.get<ProjectUser[]>(`/user-project/project/${id}`);
      setProjectUsers(response.data);
    } catch {
      setErrorMessage("Error loading project users");
    } finally {
      setUsersLoading(false);
    }
  }

  async function fetchAvailableUsers() {
    try {
      const response = await api.get<User[]>("/users");
      setAvailableUsers(response.data);
    } catch {
      setErrorMessage("Error loading available users");
    }
  }

  async function addUserToProject(userId: number) {
    try {
      await api.post("/user-project", {
        projectId: Number(id),
        userId: userId,
      });
      await fetchProjectUsers();
      setShowAddUser(false);
    } catch {
      setErrorMessage("Error adding user to project");
    }
  }

  async function removeUserFromProject(userId: number) {
    try {
      await api.delete(`/user-project/${id}/${userId}`);
      await fetchProjectUsers();
    } catch {
      setErrorMessage("Error removing user from project");
    }
  }

  async function fetchProjectTasks() {
    setTasksLoading(true);
    try {
      const response = await api.get<Task[]>(`/tasks?projectId=${id}`);
      setProjectTasks(response.data);
    } catch {
      setErrorMessage("Error loading project tasks");
    } finally {
      setTasksLoading(false);
    }
  }

  async function fetchAvailableTasks() {
    try {
      const response = await api.get<Task[]>("/tasks?projectId=null");
      setAvailableTasks(response.data);
    } catch {
      setErrorMessage("Error loading available tasks");
    }
  }

  async function addTaskToProject(taskId: number) {
    try {
      await api.put(`/tasks/${taskId}`, {
        projectId: Number(id),
      });
      await fetchProjectTasks();
      setShowAddTask(false);
    } catch {
      setErrorMessage("Error adding task to project");
    }
  }

  async function removeTaskFromProject(taskId: number) {
    try {
      await api.put(`/tasks/${taskId}`, {
        projectId: null,
      });
      await fetchProjectTasks();
    } catch {
      setErrorMessage("Error removing task from project");
    }
  }

  async function deleteProject() {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/projects/${id}`);
        navigate("/projects");
      } catch {
        setErrorMessage("Error deleting project");
      }
    }
  }

  function handleShowAddLabel() {
    setShowAddLabel(true);
    fetchAvailableLabels();
  }

  function handleShowAddUser() {
    setShowAddUser(true);
    fetchAvailableUsers();
  }

  function handleShowAddTask() {
    setShowAddTask(true);
    fetchAvailableTasks();
  }

  const isLabelAlreadyAdded = (labelId: number) => {
    return projectLabels.some(pl => pl.labelId === labelId);
  };

  const isUserAlreadyAdded = (userId: number) => {
    return projectUsers.some(pu => pu.userId === userId);
  };

  const isTaskAlreadyAdded = (taskId: number) => {
    return projectTasks.some(pt => pt.id === taskId);
  };

  return (
    <>
        <GenericBreadCrumb items=
                        {[
                            { type: "link", label: "Dashboard", to: "/" },
                            { type: "link", label: "Projects", to: "/projects" },
                            { type: "text", label: "Project Detail"}
                        ]}> 
        </GenericBreadCrumb>
    
    <div className="m-4 flex flex-col items-start">
      {isLoading ? (
        <p className="text-white mt-4">Loading project...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-200 font-bold mt-4">⚠️ {errorMessage}.</p>
      ) : project ? (
        <>
          <div className="w-full flex justify-between items-center mb-4">
            <GenericHeaderOne label={project.name} extraClassName="" />
          </div>

          <div className="w-full bg-white border-black border-1 rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
               <div>
              <p className="">
              <span className="font-bold">Start Date: </span>{formatDateTimeString(project.startDate)}
            </p>
            {project.endDate && (
              <p className="">
               <span className="font-bold">End Date: </span>{formatDateTimeString(project.endDate)}
              </p>
            )}
            <p className="">
              <span className="font-bold">Created At: </span>{formatDateTimeString(project.createdAt)}
            </p>
            </div>
                     <div className="flex gap-2 self-start">
                  <GenericButton
                  onClick={navigateToEditPage}
                  extraClassName="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                  >
                  Edit Project
                  </GenericButton>
                  <GenericButton
                  onClick={deleteProject}
                  extraClassName="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                  >
              Delete Project
            </GenericButton>
              </div>
            </div>
           
          </div>


          <div className="w-full p-2  bg-white border-1 border-black rounded-lg overflow-hidden">
            <div className="flex text-sm gap-2">
              <button
                onClick={() => setActiveTab("tasks")}
                 className={`flex-1 px-4 py-3 text-black transition-colors ${
                  activeTab === "tasks" ? "border-b-2 border-blue-500 text-black" : "border-b-2 border-black"
                }`}
              >
                Project Tasks
              </button>
              <button
                onClick={() => setActiveTab("labels")}
                 className={`flex-1 px-4 py-3 text-black transition-colors ${
                  activeTab === "labels" ? "border-b-2 border-blue-500 text-black" : "border-b-2 border-black"
                }`}
              >
                Project Labels
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 px-4 py-3 text-black transition-colors ${
                  activeTab === "users" ? "border-b-2 border-blue-500 text-black" : "border-b-2 border-black"
                }`}
              >
                Project Users
              </button>
            </div>

            <div className="p-6">
              {activeTab === "tasks" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-black font-bold">Project Tasks</h2>
                    <GenericButton
                      onClick={handleShowAddTask}
                      extraClassName="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                    >
                      Add new
                    </GenericButton>
                  </div>

                  {tasksLoading ? (
                    <p className="text-white">Loading tasks...</p>
                  ) : projectTasks.length === 0 ? (
                    <p className="text-black">No tasks linked to this project.</p>
                  ) : (
                    <div className="space-y-2">
                      {projectTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between bg-black text-white px-4 py-3 rounded"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-lg">{task.title}</span>
                            <p className="text-sm text-white mt-1">
                              <span className="font-semibold">Starts:</span> {new Date(task.startDate).toLocaleDateString()} | <span className="font-semibold">Ends:</span> {new Date(task.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <GenericButton
                              onClick={() => navigate(`/tasks/task-details/${task.id}`)}
                              extraClassName="bg-black hover:bg-gray-700 border-1 border-white text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0"
                            >
                              View
                            </GenericButton>
                            <button
                              onClick={() => removeTaskFromProject(task.id)}
                              className="text-white font-bold px-2 hover:cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddTask && (
                    <div className="mt-4 bg-black p-4 rounded">
                      <h3 className="text-white font-bold mb-3">Select a Task</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableTasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => addTaskToProject(task.id)}
                            disabled={isTaskAlreadyAdded(task.id)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                              isTaskAlreadyAdded(task.id)
                                ? "bg-gray-700 line-through text-gray-300 cursor-not-allowed"
                                : "bg-green-300 hover:cursor-pointer hover:bg-green-400 text-black"
                            }`}
                          >
                            {task.title} {isTaskAlreadyAdded(task.id) && "(already added)"}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddTask(false)}
                        className="mt-3 font-bold text-white underline hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "labels" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-black font-bold">Project Labels</h2>
                    <GenericButton
                      onClick={handleShowAddLabel}
                      extraClassName="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                    >
                      Add new
                    </GenericButton>
                  </div>

                  {labelsLoading ? (
                    <p className="text-white">Loading labels...</p>
                  ) : projectLabels.length === 0 ? (
                    <p className="text-black">No labels linked to this project.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {projectLabels.map((pl) => (
                        <div
                          key={pl.labelId}
                          className="flex items-center gap-2 bg-black text-white font-semibold px-3 py-2 rounded"
                        >
                          <span>🏷️ {pl.label.name}</span>
                          <button
                            onClick={() => removeLabelFromProject(pl.labelId)}
                            className="text-white hover:cursor-pointer font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddLabel && (
                    <div className="mt-4 bg-black p-4 rounded">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-white font-bold">Select a Label</h3>
                        <GenericButton
                          onClick={() => navigate("/labels")}
                          extraClassName="bg-bçacl hover:cursor-pointer border-1 hover:bg-gray-700 border-white text-white px-4 py-2 rounded text-sm transition-colors w-auto h-auto mt-0"
                        >
                          Create new
                        </GenericButton>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableLabels.map((label) => (
                          <button
                            key={label.id}
                            onClick={() => addLabelToProject(label.id)}
                            disabled={isLabelAlreadyAdded(label.id)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                              isLabelAlreadyAdded(label.id)
                                ? "bg-gray-700 line-through text-gray-300 cursor-not-allowed"
                                : "bg-green-300 hover:cursor-pointer hover:bg-green-400 text-black"
                            }`}
                          >
                            🏷️ {label.name} {isLabelAlreadyAdded(label.id) && "(already added)"}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddLabel(false)}
                        className="mt-3 font-bold text-white underline hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-black font-bold">Project Users</h2>
                    <GenericButton
                      onClick={handleShowAddUser}
                      extraClassName="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                    >
                      Add new
                    </GenericButton>
                  </div>

                  {usersLoading ? (
                    <p className="text-white">Loading users...</p>
                  ) : projectUsers.length === 0 ? (
                    <p className="text-black">No users linked to this project.</p>
                  ) : (
                    <div className="space-y-2">
                      {projectUsers.map((pu) => (
                        <div
                          key={pu.userId}
                          className="flex items-center justify-between bg-black text-white px-4 py-3 rounded"
                        >
                          <span className="font-medium">{pu.user.nickname}</span>
                          <button
                            onClick={() => removeUserFromProject(pu.userId)}
                            className="text-white hover:cursor-pointer font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddUser && (
                    <div className="mt-4 bg-black p-4 rounded">
                      <h3 className="text-white font-bold mb-3">Select a User</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => addUserToProject(user.id)}
                            disabled={isUserAlreadyAdded(user.id)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                              isUserAlreadyAdded(user.id)
                                ? "bg-gray-700 line-through text-gray-300 cursor-not-allowed"
                                : "bg-green-300 hover:cursor-pointer hover:bg-green-400 text-black"
                            }`}
                          >
                            {user.nickname} ({user.email}) {isUserAlreadyAdded(user.id) && "(already added)"}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddUser(false)}
                        className="mt-3 font-bold text-white underline hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-white mt-4">Project not found.</p>
      )}
    </div>
    </>
  );
}