import { useNavigate } from "react-router-dom";
import { GenericLink } from "../../components/General/GenericLink";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-black font-semibold text-2xl mb-10">
          Ops! Page not found. 🐝🍃
        </h1>

        <div className="flex gap-4">
          <GenericLink to="/" label="Return to previous page" navigationFunction={() => navigate(-1)} />
        </div>
      </div>
    </div>
  );
}
