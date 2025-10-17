import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../../services/api";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericButton } from "../../components/Forms/GenericButton";
import { GenericBreadCrumb } from "../../components/General/GenericBreadCrumb";

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

type TabType = "details" | "users";

export function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("details");

  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
        setEditedContent(response.data.content);
      } catch {
        setErrorMessage("Failed to load task");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTask();
  }, [id]);

  useEffect(() => {
    if (activeTab === "users" && id) {
      fetchTaskUsers();
    }
  }, [activeTab, id]);

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

  function handleEditContent() {
    setIsEditingContent(true);
    setShowPreview(false);
  }

  function handleCancelEdit() {
    setIsEditingContent(false);
    setShowPreview(false);
    setEditedContent(task?.content || "");
  }

  async function handleSaveContent() {
    if (!task) return;

    setIsSavingContent(true);
    try {
      await api.put(`/tasks/${id}`, {
        content: editedContent
      });
      setTask({ ...task, content: editedContent });
      setIsEditingContent(false);
      setShowPreview(false);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Error updating task content");
    } finally {
      setIsSavingContent(false);
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

  const isLabelAlreadyAdded = (labelId: number) => {
    return taskLabels.some((tl) => tl.labelId === labelId);
  };

  const isUserAlreadyAdded = (userId: number) => {
    return taskUsers.some((tu) => tu.userId === userId);
  };

  useEffect(() => {
    if (id) {
      fetchTaskLabels();
    }
  }, [id]);

  return (
    <>
                
      <GenericBreadCrumb items=
                      {[
                          { type: "link", label: "Dashboard", to: "/" },
                          { type: "link", label: "Tasks", to: "/tasks" },
                          { type: "text", label: "Task Details"}
                      ]}> 
      </GenericBreadCrumb>
    <div className="p-4 m-4 flex flex-col items-start">
      {isLoading ? (
        <p className="text-white mt-4">Loading task...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-200 font-bold mt-4">⚠️ {errorMessage}.</p>
      ) : task ? (
        <>
          <div className="w-full flex justify-between items-center mb-4">
            <GenericHeaderOne label={task.title} extraClassName="" />
            <GenericButton
              onClick={deleteTask}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
            >
              Delete Task
            </GenericButton>
          </div>

          <div className="w-full bg-blue-600 rounded-lg overflow-hidden">
            <div className="flex border-b border-blue-400">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 px-4 py-3 text-white font-medium transition-colors ${
                  activeTab === "details" ? "bg-blue-700" : "hover:bg-blue-500"
                }`}
              >
                Task Details
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 px-4 py-3 text-white font-medium transition-colors ${
                  activeTab === "users" ? "bg-blue-700" : "hover:bg-blue-500"
                }`}
              >
                Task Users
              </button>
            </div>

            <div className="p-6">
              {activeTab === "details" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-white font-bold">Task Information</h2>
                    <GenericButton
                      onClick={navigateToEditPage}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                    >
                      Edit Task
                    </GenericButton>
                  </div>

                  <div className="bg-blue-700 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-bold">Content</h3>
                      {!isEditingContent ? (
                        <GenericButton
                          onClick={handleEditContent}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0"
                        >
                          Edit Content
                        </GenericButton>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            {showPreview ? "Edit" : "Preview"}
                          </button>
                          <GenericButton
                            onClick={handleSaveContent}
                            disabled={isSavingContent}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0 disabled:bg-gray-500"
                          >
                            {isSavingContent ? "Saving..." : "Save"}
                          </GenericButton>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditingContent ? (
                      <div className="task-content-markdown bg-white rounded p-4 min-h-64 max-h-96 overflow-y-auto prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {task.content}
                        </ReactMarkdown>
                      </div>
                    ) : showPreview ? (
                      <div className="bg-white rounded p-4 min-h-64 max-h-96 overflow-y-auto prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {editedContent}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full min-h-64 max-h-96 p-3 rounded bg-blue-800 text-white font-mono text-sm border border-blue-500 focus:outline-none focus:border-blue-400"
                        placeholder="Enter markdown content..."
                      />
                    )}
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-blue-700 rounded-lg p-4">
                      <p className="text-blue-200 text-sm mb-1">Start Date</p>
                      <p className="text-white font-medium">
                        {new Date(task.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-1 bg-blue-700 rounded-lg p-4">
                      <p className="text-blue-200 text-sm mb-1">End Date</p>
                      <p className="text-white font-medium">
                        {new Date(task.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-bold">Task Labels</h3>
                      <GenericButton
                        onClick={handleShowAddLabel}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                      >
                        + Add Label
                      </GenericButton>
                    </div>

                    {labelsLoading ? (
                      <p className="text-white">Loading labels...</p>
                    ) : taskLabels.length === 0 ? (
                      <p className="text-white">No labels linked to this task.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {taskLabels.map((tl) => (
                          <div
                            key={tl.labelId}
                            className="flex items-center gap-2 bg-blue-800 text-white px-3 py-2 rounded"
                          >
                            <span>🏷️ {tl.label.name}</span>
                            <button
                              onClick={() => removeLabelFromTask(tl.labelId)}
                              className="text-red-300 hover:text-red-100 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAddLabel && (
                      <div className="mt-4 bg-blue-800 p-4 rounded">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-bold">Select a Label</h4>
                          <GenericButton
                            onClick={() => navigate("/labels")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0"
                          >
                            + Create New Label
                          </GenericButton>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {availableLabels.map((label) => (
                            <button
                              key={label.id}
                              onClick={() => addLabelToTask(label.id)}
                              disabled={isLabelAlreadyAdded(label.id)}
                              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                isLabelAlreadyAdded(label.id)
                                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                  : "bg-blue-900 hover:bg-blue-950 text-white"
                              }`}
                            >
                              🏷️ {label.name}{" "}
                              {isLabelAlreadyAdded(label.id) && "(already added)"}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowAddLabel(false)}
                          className="mt-3 text-white underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-white font-bold">Task Users</h2>
                    <GenericButton
                      onClick={handleShowAddUser}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
                    >
                      + Add User
                    </GenericButton>
                  </div>

                  {usersLoading ? (
                    <p className="text-white">Loading users...</p>
                  ) : taskUsers.length === 0 ? (
                    <p className="text-white">No users assigned to this task.</p>
                  ) : (
                    <div className="space-y-2">
                      {taskUsers.map((tu) => (
                        <div
                          key={tu.userId}
                          className="flex items-center justify-between bg-blue-700 text-white px-4 py-3 rounded"
                        >
                          <div>
                            <span className="font-medium">{tu.user.nickname}</span>
                            <p className="text-sm text-blue-200">{tu.user.email}</p>
                          </div>
                          <button
                            onClick={() => removeUserFromTask(tu.userId)}
                            className="text-red-300 hover:text-red-100 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddUser && (
                    <div className="mt-4 bg-blue-700 p-4 rounded">
                      <h3 className="text-white font-bold mb-3">Select a User</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => addUserToTask(user.id)}
                            disabled={isUserAlreadyAdded(user.id)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                              isUserAlreadyAdded(user.id)
                                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                : "bg-blue-800 hover:bg-blue-900 text-white"
                            }`}
                          >
                            {user.nickname} ({user.email}){" "}
                            {isUserAlreadyAdded(user.id) && "(already added)"}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddUser(false)}
                        className="mt-3 text-white underline"
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
        <p className="text-white mt-4">Task not found.</p>
      )}
    </div>
    </>
  );
}