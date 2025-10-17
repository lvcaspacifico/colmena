import { useState } from "react";
import colmenaIconSVG from "../../assets/brand-assets/colmena-icon.svg";
import { useAuthentication } from "../../hooks/useAuthenticationContext";
import { GenericLink } from "../General/GenericLink";

export function Navbar() {
  const { session, remove } = useAuthentication();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

  let showLoggedOptions = !!session?.user;

  return (
    <nav className="bg-black p-4 flex justify-between items-center">
        <img className="w-8 h-8" src={colmenaIconSVG} alt="Colmena's logo" />

      {showLoggedOptions && (
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="hover:cursor-pointer min-w-40 text-white font-medium px-4 py-2 border-1 rounded-lg  border-gray-100 hover:bg-gray-800"
          >
            Hello, <strong>{session?.user.nickname}</strong>! 👋🏻
          </button>
          {showUserMenu && (
            <ul className="w-full px-3 py-1 text-center absolute right-0 mt-2 bg-black border-1 rounded-lg border-gray-100 shadow-lg">
               <li><GenericLink className="text-white hover:text-blue-400" label="Projects" to="/projects" /></li>
               <li><GenericLink className="text-white hover:text-blue-400" label="Tasks" to="/tasks"/></li>
               <li><GenericLink className="text-white hover:text-blue-400" label="Labels" to="/labels"/></li>
               <li className="mt-4"><GenericLink className="text-white hover:text-blue-400" navigationFunction={remove} label="Sign Out" to="/projects" /></li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}
