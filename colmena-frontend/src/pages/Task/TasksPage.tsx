import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericLink } from "../../components/General/GenericLink";
import { GenericButton } from "../../components/Forms/GenericButton";
import { useNavigate } from "react-router";
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

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleGoToCreateTask() {
    navigate("/tasks/create-task");
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get<Task[]>("/tasks");
        setTasks(response.data);
      } catch {
        setErrorMessage("Unable to load tasks.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <>
            <GenericBreadCrumb items=
                            {[
                                { type: "link", label: "Dashboard", to: "/dashboard" },
                                { type: "text", label: "Tasks"}
                            ]}> 
            </GenericBreadCrumb>
    
    <div className="bg-blue-500 p-4 m-4 flex flex-col items-start">
      <div className="flex w-full justify-between items-center mb-4">
        <GenericHeaderOne label="Tasks" />
        <GenericButton
          onClick={handleGoToCreateTask}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
        >
          + Add Task
        </GenericButton>
      </div>

      {isLoading ? (
        <p className="text-white mt-4">Loading tasks...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-200 font-bold mt-4">⚠️ {errorMessage}.</p>
      ) : tasks.length === 0 ? (
        <p className="text-white mt-4">No tasks found.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="text-white font-medium bg-black/20 px-3 py-2 rounded flex justify-between items-center"
            >
              {task.title}
              <GenericLink
                to={`/tasks/task-details/${task.id}`}
                label="See task"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}
