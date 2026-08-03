import React from "react";
import { Link } from "react-router-dom";
import { FiGitBranch } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-600 flex items-center justify-center text-white mb-5">
        <FiGitBranch size={26} />
      </div>
      <h1 className="text-5xl font-extrabold mb-2">404</h1>
      <p className="text-gray-400 mb-6">This branch doesn't exist. The page you're looking for wasn't found.</p>
      <Link to="/dashboard" className="btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
