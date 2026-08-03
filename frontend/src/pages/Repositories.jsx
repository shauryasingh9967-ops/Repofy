import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Layout from "../components/Layout.jsx";
import RepoCard from "../components/RepoCard.jsx";
import { getRepos, createRepo, renameRepo, deleteRepo } from "../services/repoService.js";

const Repositories = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const load = async (q = "") => {
    setLoading(true);
    const res = await getRepos(q);
    setRepos(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (query) => load(query);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createRepo(form.name, form.description);
      setShowModal(false);
      setForm({ name: "", description: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create repository");
    }
  };

  const handleRename = async (repoId, name) => {
    await renameRepo(repoId, name);
    load();
  };

  const handleDelete = async (repoId) => {
    if (!window.confirm("Delete this repository and all its files, commits, and history? This cannot be undone.")) return;
    await deleteRepo(repoId);
    load();
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Repositories</h1>
          <p className="text-sm text-gray-400">Manage all your version-controlled projects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> New Repository
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading repositories...</p>
      ) : repos.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-400 mb-4">You don't have any repositories yet.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create your first repository
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} onRename={handleRename} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowModal(false)}>
          <div className="card p-6 w-full max-w-md fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-4">Create Repository</h2>
            {error && <p className="mb-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                autoFocus
                required
                placeholder="Repository name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="input-field resize-none"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Repositories;
