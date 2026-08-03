import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFolder, FiGitCommit, FiPlusCircle, FiUpload, FiActivity } from "react-icons/fi";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getDashboardStats, getRecentActivity } from "../services/dashboardService.js";
import { createRepo } from "../services/repoService.js";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ repoCount: 0, commitCount: 0 });
  const [activities, setActivities] = useState([]);
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    const [statsRes, actRes] = await Promise.all([getDashboardStats(), getRecentActivity(8)]);
    setStats(statsRes.data);
    setActivities(actRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickCreate = async () => {
    const name = window.prompt("Repository name:");
    if (!name) return;
    setCreating(true);
    try {
      const res = await createRepo(name, "");
      navigate(`/repositories/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create repository");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <div className="card p-6 mb-6 bg-gradient-to-br from-accent-600 to-accent-700 text-white border-none">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {currentUser?.name || "Developer"} 👋</h1>
        <p className="text-accent-100 text-sm">Here's what's happening across your repositories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center text-accent-600">
            <FiFolder size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.repoCount}</p>
            <p className="text-xs text-gray-400">Repositories</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
            <FiGitCommit size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.commitCount}</p>
            <p className="text-xs text-gray-400">Total Commits</p>
          </div>
        </div>
        <button onClick={handleQuickCreate} disabled={creating} className="card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 text-left">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
            <FiPlusCircle size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm">New Repository</p>
            <p className="text-xs text-gray-400">Quick create</p>
          </div>
        </button>
        <button onClick={() => navigate("/repositories")} className="card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 text-left">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
            <FiUpload size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm">Browse Repositories</p>
            <p className="text-xs text-gray-400">Manage your projects</p>
          </div>
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiActivity className="text-accent-600" size={18} />
          <h2 className="font-semibold">Recent Activity</h2>
        </div>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No recent activity yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {activities.map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between text-sm">
                <span>{a.message}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-3">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
