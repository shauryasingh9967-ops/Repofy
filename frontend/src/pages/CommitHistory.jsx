import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Layout from "../components/Layout.jsx";
import CommitList from "../components/CommitList.jsx";
import { getRepoById } from "../services/repoService.js";
import { getCommitHistory, searchCommits, restoreVersion } from "../services/minigitService.js";

const CommitHistory = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [repoRes, commitsRes] = await Promise.all([getRepoById(repoId), getCommitHistory(repoId)]);
      setRepo(repoRes.data);
      setCommits(commitsRes.data);
    } catch (err) {
      if (err.response?.status === 404) navigate("/repositories");
    } finally {
      setLoading(false);
    }
  }, [repoId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = async (query) => {
    if (!query.trim()) return load();
    const res = await searchCommits(repoId, query);
    setCommits(res.data);
  };

  const handleRestore = async (commitId) => {
    if (!window.confirm(`Restore all files to commit ${commitId.slice(0, 7)}? This will overwrite current file content.`)) return;
    await restoreVersion(repoId, commitId);
    alert("Repository restored successfully");
    load();
  };

  return (
    <Layout onSearch={handleSearch}>
      <button onClick={() => navigate(`/repositories/${repoId}`)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent-600 mb-4">
        <FiArrowLeft size={14} /> Back to repository
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold">Commit History</h1>
        <p className="text-sm text-gray-400">{repo?.name}</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading commits...</p>
      ) : (
        <div className="card p-6">
          <CommitList commits={commits} onRestore={handleRestore} />
        </div>
      )}
    </Layout>
  );
};

export default CommitHistory;
