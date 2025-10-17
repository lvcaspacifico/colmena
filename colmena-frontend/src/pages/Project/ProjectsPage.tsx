import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericLink } from "../../components/General/GenericLink";
import { GenericButton } from "../../components/Forms/GenericButton";
import { useNavigate } from "react-router";
import { GenericBreadCrumb } from "../../components/General/GenericBreadCrumb";
import { GenericHorizontalLine } from "../../components/General/GenericHorizontalLine";

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
    <>
    <GenericBreadCrumb items=
                    {[
                        { type: "link", label: "Dashboard", to: "/" },
                        { type: "text", label: "Projects"}
                    ]}> 
    </GenericBreadCrumb>
    
    <div className="m-4 flex flex-col items-start">
      <div className="flex w-full justify-between items-center mb-4">                    
        <GenericHeaderOne label="Projects"/>
        <GenericButton
          onClick={handleGoToCreateProject}
          extraClassName="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0">
               Create new
          </GenericButton>
      </div>

      {isLoading ? (
        <p className="text-white mt-4">Loading projects...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-500 font-bold mt-4">⚠️ {errorMessage}.</p>
      ) : projects.length === 0 ? (
        <p className="text-white mt-4">No projects found.</p>
      ) : (
        <ul className="flex flex-col mb-4 w-full">
          {projects.map((project) => (
            
            <li
              key={project.id}
              className="flex justify-between items-center p-4 border-b-gray-400 first:border-t-1 first:border-t-gray-400 border-b-1 text-black">
             
              <div className="flex items-center gap-2">
                <div className="text-black bg-pink-300 w-10 h-10 flex 
                items-center justify-center rounded border-1 border-gray-300">P</div>
                <GenericLink extraClassName="text-md text-black font-semibold m-0" to={`/projects/project-details/${project.id}`} label={project.name}/>
              </div>
            
            
            </li> 
          ))}
        </ul>
      )}
    </div>
    </>
  );
}
