import { useNavigate } from "react-router-dom";
import { GenericLink } from "../../components/General/GenericLink";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-black font-semibold text-5xl">
          Join the hive.
        </h1>

        <div className="flex gap-4">
          <GenericLink to="/" label="Loga nessa joça" navigationFunction={() => navigate("/signin")} />
          <GenericLink to="/" label="Cadastrar nessa joça" navigationFunction={() => navigate("/signup")} />
        </div>
      </div>
    </div>
  );
}
