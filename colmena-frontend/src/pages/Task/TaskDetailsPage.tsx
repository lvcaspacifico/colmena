import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericButton } from "../../components/Forms/GenericButton";
import { GenericBreadCrumb } from "../../components/General/GenericBreadCrumb";
import { GenericMarkdownRenderField } from "../../components/Task/GenericMarkdownRenderField";

type Task = {
  id: number;
  projectId: number | null;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

type TaskLabel = {
  taskId: number;
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

type TaskUser = {
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

export function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [taskLabels, setTaskLabels] = useState<TaskLabel[]>([]);
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);

  const [taskUsers, setTaskUsers] = useState<TaskUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await api.get<Task>(`/tasks/task/${id}`);
        setTask(response.data);
      } catch {
        setErrorMessage("Failed to load task");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTask();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTaskLabels();
      fetchTaskUsers();
    }
  }, [id]);

  async function fetchTaskLabels() {
    setLabelsLoading(true);
    try {
      const response = await api.get<TaskLabel[]>(`/task-label/task/${id}`);
      setTaskLabels(response.data);
    } catch {
      setErrorMessage("Error loading task labels");
    } finally {
      setLabelsLoading(false);
    }
  }

  async function fetchAvailableLabels() {
    try {
      const response = await api.get<Label[]>("/labels/task");
      setAvailableLabels(response.data);
    } catch {
      setErrorMessage("Error loading available labels");
    }
  }

  async function addLabelToTask(labelId: number) {
    try {
      await api.post("/task-label", {
        taskId: Number(id),
        labelId: labelId,
      });
      await fetchTaskLabels();
      setShowAddLabel(false);
    } catch {
      setErrorMessage("Error adding label to task");
    }
  }

  async function removeLabelFromTask(labelId: number) {
    try {
      await api.delete(`/task-label/${id}/${labelId}`);
      await fetchTaskLabels();
    } catch {
      setErrorMessage("Error removing label from task");
    }
  }

  async function fetchTaskUsers() {
    setUsersLoading(true);
    try {
      const response = await api.get<TaskUser[]>(`/user-task/task/${id}`);
      setTaskUsers(response.data);
    } catch {
      setErrorMessage("Error loading task users");
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

  async function addUserToTask(userId: number) {
    try {
      await api.post("/user-task", {
        taskId: Number(id),
        userId: userId,
      });
      await fetchTaskUsers();
      setShowAddUser(false);
    } catch {
      setErrorMessage("Error adding user to task");
    }
  }

  async function removeUserFromTask(userId: number) {
    try {
      await api.delete(`/user-task/${id}/${userId}`);
      await fetchTaskUsers();
    } catch {
      setErrorMessage("Error removing user from task");
    }
  }

  async function deleteTask() {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        navigate("/tasks");
      } catch {
        setErrorMessage("Error deleting task");
      }
    }
  }

  function navigateToEditPage() {
    navigate(`/tasks/edit-task/${id}`);
  }

  async function handleSaveContent(newContent: string) {
    if (!task) return;

    await api.put(`/tasks/${id}`, {
      content: newContent,
    });
    setTask({ ...task, content: newContent });
  }

  function handleShowAddLabel() {
    setShowAddLabel(true);
    fetchAvailableLabels();
  }

  function handleShowAddUser() {
    setShowAddUser(true);
    fetchAvailableUsers();
  }

  const isLabelAlreadyAdded = (labelId: number) => {
    return taskLabels.some((tl) => tl.labelId === labelId);
  };

  const isUserAlreadyAdded = (userId: number) => {
    return taskUsers.some((tu) => tu.userId === userId);
  };

  return (
    <>
      <GenericBreadCrumb
        items={[
          { type: "link", label: "Dashboard", to: "/" },
          { type: "link", label: "Tasks", to: "/tasks" },
          { type: "text", label: "Task Details" },
        ]}
      ></GenericBreadCrumb>

      <div className=" m-4 flex flex-col items-start">
        {isLoading ? (
          <p className="text-white mt-4">Loading task...</p>
        ) : errorMessage ? (
          <p className="text-sm text-red-200 font-bold mt-4">
            ⚠️ {errorMessage}.
          </p>
        ) : task ? (
          <>
            <div className="w-full mb-4 flex items-start">
              <GenericHeaderOne label={task.title} extraClassName="" />
            </div>

            <div className="w-full flex gap-4">
              <div className="flex-1 w-4/5 bg-amber-200">
                <GenericMarkdownRenderField
                  initialContent={task.content}
                  onSave={handleSaveContent}
                />
              </div>
              <div className="w-1/5 border-black border-1 p-4 rounded-lg">
                <div className="bg-white border-gray-300 border-1 rounded-lg p-6 mb-4">
                  <h2 className="text-xl text-black font-bold my-2">
                    General Information
                  </h2>
                  <div>
                    <p className="mb-2">
                      <span className="font-bold">Start Date: </span>
                      {new Date(task.startDate).toLocaleDateString()}
                    </p>
                    <p className="mb-2">
                      <span className="font-bold">End Date: </span>
                      {new Date(task.endDate).toLocaleDateString()}
                    </p>
                    <p className="">
                      <span className="font-bold">Created At: </span>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white border-black border-1 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg text-black font-bold">Users</h2>
                    <GenericButton
                      onClick={handleShowAddUser}
                      extraClassName="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0"
                    >
                      Add
                    </GenericButton>
                  </div>

                  {usersLoading ? (
                    <p className="text-black text-sm">Loading...</p>
                  ) : taskUsers.length === 0 ? (
                    <p className="text-black text-sm">No users assigned.</p>
                  ) : (
                    <div className="space-y-2">
                      {taskUsers.map((tu) => (
                        <div
                          key={tu.userId}
                          className="flex items-center justify-between bg-black text-white px-3 py-2 rounded text-sm"
                        >
                          <span className="font-medium truncate">
                            {tu.user.nickname}
                          </span>
                          <button
                            onClick={() => removeUserFromTask(tu.userId)}
                            className="text-white hover:cursor-pointer font-bold ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddUser && (
                    <div className="mt-4 bg-black p-3 rounded">
                      <h3 className="text-white font-bold mb-3 text-sm">
                        Select a User
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => addUserToTask(user.id)}
                            disabled={isUserAlreadyAdded(user.id)}
                            className={`w-full text-left px-2 py-2 rounded transition-colors text-sm ${
                              isUserAlreadyAdded(user.id)
                                ? "bg-gray-700 line-through text-gray-300 cursor-not-allowed"
                                : "bg-green-300 hover:cursor-pointer hover:bg-green-400 text-black"
                            }`}
                          >
                            {user.nickname}{" "}
                            {isUserAlreadyAdded(user.id) && "(added)"}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddUser(false)}
                        className="mt-3 font-bold text-white underline hover:cursor-pointer text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white border-black border-1 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg text-black font-bold">Labels</h2>
                    <GenericButton
                      onClick={handleShowAddLabel}
                      extraClassName="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0"
                    >
                      Add
                    </GenericButton>
                  </div>

                  {labelsLoading ? (
                    <p className="text-black text-sm">Loading...</p>
                  ) : taskLabels.length === 0 ? (
                    <p className="text-black text-sm">No labels linked.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {taskLabels.map((tl) => (
                        <div
                          key={tl.labelId}
                          className="flex items-center gap-1 bg-black text-white font-semibold px-2 py-1 rounded text-xs"
                        >
                          <span>🏷️ {tl.label.name}</span>
                          <button
                            onClick={() => removeLabelFromTask(tl.labelId)}
                            className="text-white hover:cursor-pointer font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddLabel && (
                    <div className="mt-4 bg-black p-3 rounded">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-bold text-sm">
                          Select a Label
                        </h4>
                        <GenericButton
                          onClick={() => navigate("/labels")}
                          extraClassName="bg-black hover:cursor-pointer border-1 hover:bg-gray-700 border-white text-white px-2 py-1 rounded text-xs transition-colors w-auto h-auto mt-0"
                        >
                          Create
                        </GenericButton>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableLabels.map((label) => (
                          <button
                            key={label.id}
                            onClick={() => addLabelToTask(label.id)}
                            disabled={isLabelAlreadyAdded(label.id)}
                            className={`w-full text-left px-2 py-2 rounded transition-colors text-sm ${
                              isLabelAlreadyAdded(label.id)
                                ? "bg-gray-700 line-through text-gray-300 cursor-not-allowed"
                                : "bg-green-300 hover:cursor-pointer hover:bg-green-400 text-black"
                            }`}
                          >
                            🏷️ {label.name}{" "}
                            {isLabelAlreadyAdded(label.id) && "(added)"}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddLabel(false)}
                        className="mt-3 font-bold text-white underline hover:cursor-pointer text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white border-black border-1 rounded-lg p-4 mt-4">
                  <h2 className="text-lg text-black font-bold">Danger zone</h2>

                  <div className="w-full flex justify-center gap-2 mt-4">
                    <GenericButton
                      onClick={navigateToEditPage}
                      extraClassName="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                    >
                      Edit Task
                    </GenericButton>
                    <GenericButton
                      onClick={deleteTask}
                      extraClassName="text-xs bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                    >
                      Delete Task
                    </GenericButton>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-white mt-4">Task not found.</p>
        )}
      </div>
    </>
  );
}