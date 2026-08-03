import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiPlay, FiPlus, FiUpload, FiClock, FiArrowLeft } from "react-icons/fi";
import Layout from "../components/Layout.jsx";
import FileList from "../components/FileList.jsx";
import StagingArea from "../components/StagingArea.jsx";
import { getRepoById, initRepo } from "../services/repoService.js";
import { createFile, uploadFile, getFiles, updateFile, deleteFile, downloadFile } from "../services/fileService.js";
import {
  getRepoStatus,
  getStagingArea,
  stageFile,
  unstageFile,
  commitChanges,
} from "../services/minigitService.js";

const RepositoryDetails = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const [staged, setStaged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [fileForm, setFileForm] = useState({ name: "", content: "" });

  const loadAll = useCallback(async () => {
    try {
      const [repoRes, filesRes, statusRes, stagedRes] = await Promise.all([
        getRepoById(repoId),
        getFiles(repoId),
        getRepoStatus(repoId),
        getStagingArea(repoId),
      ]);
      setRepo(repoRes.data);
      setFiles(filesRes.data);
      setStatus(statusRes.data);
      setStaged(stagedRes.data);
    } catch (err) {
      if (err.response?.status === 404) navigate("/repositories");
    } finally {
      setLoading(false);
    }
  }, [repoId, navigate]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const statusMap = {};
  (status?.files || []).forEach((f) => (statusMap[f.fileId] = f.state));
  const stagedIds = new Set(staged.map((s) => s.fileId));

  const handleInit = async () => {
    await initRepo(repoId);
    loadAll();
  };

  const openCreateModal = () => {
    setEditingFile(null);
    setFileForm({ name: "", content: "" });
    setShowFileModal(true);
  };

  const openEditModal = (file) => {
    setEditingFile(file);
    setFileForm({ name: file.name, content: file.content });
    setShowFileModal(true);
  };

  const handleSaveFile = async (e) => {
    e.preventDefault();
    if (editingFile) {
      await updateFile(repoId, editingFile.id, fileForm.content);
    } else {
      await createFile(repoId, fileForm.name, fileForm.content);
    }
    setShowFileModal(false);
    loadAll();
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      await uploadFile(repoId, file.name, text);
      loadAll();
    };
    input.click();
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    await deleteFile(repoId, fileId);
    loadAll();
  };

  const handleStage = async (fileId) => {
    await stageFile(repoId, fileId);
    loadAll();
  };

  const handleUnstage = async (fileId) => {
    await unstageFile(repoId, fileId);
    loadAll();
  };

  const handleCommit = async (message) => {
    setCommitting(true);
    try {
      await commitChanges(repoId, message);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Commit failed");
    } finally {
      setCommitting(false);
    }
  };

  if (loading || !repo) {
    return (
      <Layout>
        <p className="text-sm text-gray-400">Loading repository...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <button onClick={() => navigate("/repositories")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent-600 mb-4">
        <FiArrowLeft size={14} /> Back to repositories
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">{repo.name}</h1>
          <p className="text-sm text-gray-400">{repo.description || "No description"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/repositories/${repoId}/history`} className="btn-secondary flex items-center gap-2 text-sm">
            <FiClock size={15} /> Commit History
          </Link>
          {!repo.initialized && (
            <button onClick={handleInit} className="btn-primary flex items-center gap-2 text-sm">
              <FiPlay size={15} /> Initialize Repository
            </button>
          )}
        </div>
      </div>

      {!repo.initialized && (
        <div className="card p-4 mb-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-sm">
          This repository hasn't been initialized. Initialize it to enable staging and commits.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Files</h3>
            <div className="flex gap-2">
              <button onClick={openCreateModal} className="btn-secondary flex items-center gap-1.5 text-xs">
                <FiPlus size={14} /> New File
              </button>
              <button onClick={handleUploadClick} className="btn-secondary flex items-center gap-1.5 text-xs">
                <FiUpload size={14} /> Upload
              </button>
            </div>
          </div>
          <FileList
            files={files}
            statusMap={statusMap}
            stagedIds={stagedIds}
            onEdit={openEditModal}
            onDelete={handleDeleteFile}
            onDownload={(file) => downloadFile(repoId, file)}
            onStage={handleStage}
            onUnstage={handleUnstage}
          />
        </div>

        <StagingArea stagedFiles={staged} onUnstage={handleUnstage} onCommit={handleCommit} committing={committing} />
      </div>

      {showFileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowFileModal(false)}>
          <div className="card p-6 w-full max-w-lg fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-4">{editingFile ? `Edit ${editingFile.name}` : "New File"}</h2>
            <form onSubmit={handleSaveFile} className="space-y-4">
              {!editingFile && (
                <input
                  autoFocus
                  required
                  placeholder="File name (e.g. index.js)"
                  value={fileForm.name}
                  onChange={(e) => setFileForm({ ...fileForm, name: e.target.value })}
                  className="input-field"
                />
              )}
              <textarea
                placeholder="File content..."
                value={fileForm.content}
                onChange={(e) => setFileForm({ ...fileForm, content: e.target.value })}
                rows={10}
                className="input-field resize-none font-mono text-xs"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowFileModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default RepositoryDetails;
