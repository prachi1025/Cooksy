import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-emerald-400 font-semibold tracking-tight"
        >
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs">
            <span className="text-xl">🍳</span>
          </span>
          <span>Cooksy</span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/generate"
              className={({ isActive }) =>
                `px-2 py-1 rounded-full ${
                  isActive ? "bg-slate-800 text-emerald-400" : "text-slate-300"
                }`
              }
            >
              Generate
            </NavLink>
            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                `px-2 py-1 rounded-full ${
                  isActive ? "bg-slate-800 text-emerald-400" : "text-slate-300"
                }`
              }
            >
              Bookmarks
            </NavLink>
            <span className="hidden sm:inline text-xs text-slate-400 truncate max-w-[120px]">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
            >
              Logout
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-sm">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full border text-xs ${
                  isActive
                    ? "border-emerald-500 text-emerald-400"
                    : "border-slate-700 text-slate-300"
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs ${
                  isActive
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                } transition`
              }
            >
              Sign up
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;




