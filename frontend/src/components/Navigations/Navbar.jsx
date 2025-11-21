import React from "react";
import useAuthStore from "../../store/auth";
import { user_role } from "../../constant/enum";
import { useNavigate } from "react-router-dom";
import { LogOut, User2 } from "lucide-react";
import userRoundImage from "../../assets/img/user-round.png";

const Navbar = ({ toggleDrawer, toggleTheme, theme }) => {
  const { user, actionLogout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-100 border-b border-base-300 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex-none lg:hidden">
        <label
          htmlFor="main-drawer"
          className="btn btn-square btn-ghost"
          onClick={toggleDrawer}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <a
          onClick={() => navigate("/")}
          className="btn btn-ghost text-xl font-bold text-primary"
        >
          {import.meta.env.VITE_NAME}
        </a>
      </div>

      {/* profileDropdown */}
      <div className="flex  items-center justify-end px-0 gap-2">
        {/* toggleTheme */}
        <label className="swap swap-rotate hover:bg-base-300 p-1 rounded-full w-8 h-8">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme == "dark"}
          />

          {/* sun icon */}
          <svg
            className="swap-on h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-off h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        <div className="flex items-stretch">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="cursor-pointer">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={
                      user?.profile_image_url
                        ? `${import.meta.env.VITE_API_URL}${
                            user.profile_image_url
                          }`
                        : userRoundImage
                    }
                    alt="profile"
                    onError={(e) => {
                      console.log(e);
                      e.target.onerror = null;
                      e.target.src = userRoundImage;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-200 rounded-box z-1 mt-0 w-52 p-2 shadow-sm"
            >
              <div className="w-full border-b border-base-300 mb-2 py-1 px-2.5">
                <h1 className="font-semibold truncate">{user?.name}</h1>
                <h1 className="font-semibold truncate">{user?.email}</h1>
              </div>
              <li>
                <a className="inline-flex" onClick={() => navigate("/profile")}>
                  <User2 className="w-4 h-4 " /> Profile
                </a>
              </li>
              <li>
                <a className="inline-flex" onClick={actionLogout}>
                  <LogOut className="w-4 h-4 " />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
