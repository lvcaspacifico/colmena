import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericLink } from "../../components/General/GenericLink";
import { GenericButton } from "../../components/Forms/GenericButton";
import { useNavigate } from "react-router";

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleGoToCreateProject(){
    navigate("/projects/create-project")
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get<Project[]>("/projects");
        setProjects(response.data);
      } catch {
        setErrorMessage("Não foi possível carregar os projetos");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="bg-red-200 p-4 m-4 flex flex-col items-start">
      
      <div className="flex w-full justify-between items-center mb-4">                    
        <GenericHeaderOne label="Projects"/>
        <GenericButton
          onClick={handleGoToCreateProject}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0">
                + Add Project
          </GenericButton>
        </div>

      {isLoading ? (
        <p className="text-white mt-4">Loading projects...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-200 font-bold mt-4">⚠️ {errorMessage}.</p>
      ) : projects.length === 0 ? (
        <p className="text-white mt-4">No projects found.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="text-white font-medium bg-black/20 px-3 py-2 rounded"
            >
              {project.name} | <GenericLink to={`/projects/project-details/${project.id}`} label="See project"/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
