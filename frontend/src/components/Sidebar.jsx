import React from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiFolder, FiSettings, FiGitBranch } from "react-icons/fi";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/repositories", label: "Repositories", icon: FiFolder },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-accent-600 flex items-center justify-center text-white">
          <FiGitBranch size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight">Repofy</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 pt-6 text-xs text-gray-400 dark:text-gray-600">
        Repofy v3.0 — MongoDB + Auth
      </div>
    </aside>
  );
};

export default Sidebar;
