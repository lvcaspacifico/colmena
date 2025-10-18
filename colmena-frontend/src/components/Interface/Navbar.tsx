import { useState } from "react";
import colmenaIconSVG from "../../assets/brand-assets/colmena-icon.svg";
import { useAuthentication } from "../../hooks/useAuthenticationContext";
import { GenericLink } from "../General/GenericLink"; 
import { useLocation } from "react-router";

export function Navbar() {
  const { session, remove } = useAuthentication();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);
  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);

  const location = useLocation();
  const isSignupPage = location.pathname === "/signup" || location.pathname === "/signin";

  let showLoggedOptions = !!session?.user;

  return (
    <nav className="bg-black p-4 flex justify-between items-center relative">
        <img className="w-8 h-8" src={colmenaIconSVG} alt="Colmena's logo" />

      {showLoggedOptions && (
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="hover:cursor-pointer min-w-32 desktop:min-w-40 text-white font-medium px-3 desktop:px-4 py-2 border-1 rounded-lg border-gray-100 hover:bg-gray-800 text-sm desktop:text-base"
          >
            Hello, <strong>{session?.user.nickname}</strong>! 👋🏻
          </button>
          {showUserMenu && (
            <ul className="w-full px-3 py-1 text-center absolute right-0 mt-2 bg-black border-1 rounded-lg border-gray-100 shadow-lg z-50">
               <li><GenericLink extraClassName="text-white hover:text-blue-400" label="Projects" to="/projects" /></li>
               <li><GenericLink extraClassName="text-white hover:text-blue-400" label="Tasks" to="/tasks"/></li>
               <li><GenericLink extraClassName="text-white hover:text-blue-400" label="Labels" to="/labels"/></li>
               <li className="mt-4"><GenericLink extraClassName="text-white hover:text-blue-400" navigationFunction={remove} label="Sign Out" to="/projects" /></li>
            </ul>
          )}
        </div>
      )}

      {(!showLoggedOptions && !isSignupPage) && (
        <>
        <button
          onClick={toggleMobileMenu}
          className="desktop:hidden text-white p-2 hover:bg-gray-800 rounded-lg"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showMobileMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="hidden desktop:flex gap-8">
          <GenericLink label="Pricing" to="#pricing" extraClassName="p-0 m-0 no-underline text-white font-bold"></GenericLink>
          <GenericLink label="Testimonials" to="#testimonials" extraClassName="p-0 m-0 no-underline text-white font-bold"></GenericLink>
          <GenericLink label="Community" to="#social-media" extraClassName="p-0 m-0 no-underline text-white font-bold"></GenericLink>
          <GenericLink label="Contact Us" to="#contact-form" extraClassName="p-0 m-0 no-underline text-white font-bold"></GenericLink>
        </div>
        <div className="hidden desktop:flex gap-4 justify-center items-center text-center">
           <GenericLink
          to="/signin" label="Sign In" extraClassName="m-0 text-white no-underline"></GenericLink>
          <br />
          <GenericLink
          to="/signup" label="Get Started" extraClassName="text-white no-underline hover:bg-colmena-orange-500 hover:text-white 
          rounded-md
          bg-colmena-orange px-6 py-3 m-0"></GenericLink>
        </div>

        {showMobileMenu && (
          <div className="desktop:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-800 shadow-lg z-50">
            <div className="flex flex-col p-4 gap-4">
              <GenericLink 
                label="Pricing" 
                to="#pricing" 
                extraClassName="text-white font-bold hover:text-colmena-orange no-underline"
                onClick={() => setShowMobileMenu(false)}
              />
              <GenericLink 
                label="Testimonials" 
                to="#testimonials" 
                extraClassName="text-white font-bold hover:text-colmena-orange no-underline"
                onClick={() => setShowMobileMenu(false)}
              />
              <GenericLink 
                label="Community" 
                to="#social-media" 
                extraClassName="text-white font-bold hover:text-colmena-orange no-underline"
                onClick={() => setShowMobileMenu(false)}
              />
              <GenericLink 
                label="Contact Us" 
                to="#contact-form" 
                extraClassName="text-white font-bold hover:text-colmena-orange no-underline"
                onClick={() => setShowMobileMenu(false)}
              />
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-800">
                <GenericLink
                  to="/signin" 
                  label="Sign In" 
                  extraClassName="text-white no-underline hover:text-colmena-orange"
                  onClick={() => setShowMobileMenu(false)}
                />
                <GenericLink
                  to="/signup" 
                  label="Get Started" 
                  extraClassName="text-white no-underline bg-colmena-orange hover:bg-colmena-orange-500 rounded-md px-6 py-3 text-center"
                  onClick={() => setShowMobileMenu(false)}
                />
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </nav>
  );
}