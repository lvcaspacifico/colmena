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
      <GenericBreadCrumb
        items={[
          { type: "link", label: "Dashboard", to: "/" },
          { type: "text", label: "Tasks" },
        ]}
      />

      <div className="m-4 flex flex-col items-start">
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
          <p className="text-sm text-red-500 font-bold mt-4">⚠️ {errorMessage}.</p>
        ) : tasks.length === 0 ? (
          <p className="text-white mt-4">No tasks found.</p>
        ) : (
          <ul className="flex flex-col mb-4 w-full">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center p-4 border-b-1 border-b-gray-400 first:border-t-1 first:border-t-gray-400 text-black bg-white"
              >
                <div className="flex items-center gap-2">
                  <div className="text-black bg-amber-200 w-10 h-10 flex items-center justify-center rounded border border-gray-300">
                    T
                  </div>
                  <GenericLink
                    className="text-md text-black font-semibold m-0"
                    to={`/tasks/task-details/${task.id}`}
                    label={task.title}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
