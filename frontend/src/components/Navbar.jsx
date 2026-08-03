import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiLogOut, FiUser, FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = ({ onSearch }) => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 md:hidden">
        <FiMenu size={22} />
      </div>

      {onSearch && (
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="input-field max-w-xs hidden sm:block"
        />
      )}

      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Toggle dark mode"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800">
          <FiUser size={16} />
          <span className="text-sm font-medium truncate max-w-[140px]">{currentUser?.name}</span>
        </div>

        <button onClick={handleLogout} className="btn-danger flex items-center gap-2 text-sm" title="Logout">
          <FiLogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
