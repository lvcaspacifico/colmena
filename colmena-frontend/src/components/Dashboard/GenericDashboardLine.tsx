import { GenericLink } from "../General/GenericLink";
import { formatDateTimeString } from "../../utils/String/formatDateTimeString";
import { GenericHorizontalLine } from "../General/GenericHorizontalLine";

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
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

type SharedData = {
  projects: Project[];
  tasks: Task[];
};

type Props = {
  sharedData: SharedData;
};

export function GenericDashboardLine({ sharedData }: Props) {
  
   function renderLine(item: Project | Task, type: "project" | "task", joinedAt?: string) {
  const name = type === "project" ? (item as Project).name : (item as Task).title;
  const createdAt = item.createdAt;

  return (
    <li
      key={`${type}-${item.id}`}
      className="flex justify-between items-center p-4 border-b-gray-400 first:border-t-1 first:border-t-gray-400 border-b-1 text-black"
    >
      <div className="flex items-center gap-2">
        <div
          className={`text-black ${
            type === "project" ? "bg-pink-300" : "bg-amber-200"
          } w-10 h-10 flex items-center justify-center rounded border-1 border-gray-300`}
        >
          {type === "project" ? "P" : "T"}
        </div>

        <div className="flex flex-col">
          <GenericLink
            extraClassName="text-black font-semibold m-0"
            label={name}
            to={
              type === "project"
                ? `/projects/project-details/${item.id}`
                : `/tasks/task-details/${item.id}`
            }
          />
          <span className="text-gray-300 text-sm capitalize">{type}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-gray-700 text-xs text-right italic font-medium">
        <div>Created {formatDateTimeString(createdAt)}</div>
      </div>
    </li>
  );
}

  return (
    <ul className="flex flex-col">
      {sharedData.projects.map((p) => renderLine(p, "project", p.createdAt))}
      {sharedData.tasks.map((t) => renderLine(t, "task", t.createdAt))}
    </ul>
  );
}
