import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFolder, FiEdit2, FiTrash2, FiCheckCircle, FiCircle } from "react-icons/fi";

const RepoCard = ({ repo, onRename, onDelete }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(repo.name);

  const submitRename = (e) => {
    e.stopPropagation();
    if (name.trim() && name !== repo.name) onRename(repo.id, name.trim());
    setEditing(false);
  };

  return (
    <div
      onClick={() => !editing && navigate(`/repositories/${repo.id}`)}
      className="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center text-accent-600">
          <FiFolder size={18} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Rename"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(repo.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500"
            title="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={submitRename} onClick={(e) => e.stopPropagation()} className="mb-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={submitRename}
            className="input-field text-sm py-1.5"
          />
        </form>
      ) : (
        <h3 className="font-semibold text-base mb-1 truncate">{repo.name}</h3>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
        {repo.description || "No description provided"}
      </p>

      <div className="flex items-center gap-1.5 mt-3 text-xs">
        {repo.initialized ? (
          <>
            <FiCheckCircle className="text-green-500" size={14} />
            <span className="text-green-600 dark:text-green-400 font-medium">Initialized</span>
          </>
        ) : (
          <>
            <FiCircle className="text-gray-400" size={14} />
            <span className="text-gray-400">Not initialized</span>
          </>
        )}
      </div>
    </div>
  );
};

export default RepoCard;
