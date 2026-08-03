import React, { useState } from "react";
import { FiPackage, FiMinusCircle } from "react-icons/fi";

const StagingArea = ({ stagedFiles, onUnstage, onCommit, committing }) => {
  const [message, setMessage] = useState("");

  const handleCommit = () => {
    if (!message.trim()) return;
    onCommit(message.trim());
    setMessage("");
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <FiPackage className="text-accent-600" size={18} />
        <h3 className="font-semibold">Staging Area</h3>
        <span className="text-xs text-gray-400">({stagedFiles.length} staged)</span>
      </div>

      {stagedFiles.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">No files staged for commit.</p>
      ) : (
        <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {stagedFiles.map((f) => (
            <li key={f.fileId} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <span className="truncate">{f.fileName}</span>
              <button onClick={() => onUnstage(f.fileId)} className="text-amber-600 p-1" title="Unstage">
                <FiMinusCircle size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a commit message..."
        rows={2}
        className="input-field resize-none mb-3"
      />

      <button
        onClick={handleCommit}
        disabled={stagedFiles.length === 0 || !message.trim() || committing}
        className="btn-primary w-full"
      >
        {committing ? "Committing..." : "Commit Changes"}
      </button>
    </div>
  );
};

export default StagingArea;
