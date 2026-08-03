import React from "react";
import { FiFile, FiDownload, FiTrash2, FiEdit3, FiPlusCircle, FiMinusCircle } from "react-icons/fi";

const stateColors = {
  untracked: "text-gray-400 bg-gray-100 dark:bg-gray-800",
  staged: "text-blue-600 bg-blue-50 dark:bg-blue-950",
  "modified-after-staging": "text-amber-600 bg-amber-50 dark:bg-amber-950",
  committed: "text-green-600 bg-green-50 dark:bg-green-950",
  modified: "text-orange-600 bg-orange-50 dark:bg-orange-950",
};

const FileList = ({ files, statusMap, stagedIds, onEdit, onDelete, onDownload, onStage, onUnstage }) => {
  if (files.length === 0) {
    return <p className="text-sm text-gray-400 py-6 text-center">No files yet. Create or upload one to get started.</p>;
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {files.map((file) => {
        const state = statusMap?.[file.id] || "untracked";
        const isStaged = stagedIds?.has(file.id);
        return (
          <div key={file.id} className="flex items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FiFile className="text-gray-400 shrink-0" size={18} />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <span className={`inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded-full font-medium ${stateColors[state]}`}>
                  {state}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isStaged ? (
                <button onClick={() => onUnstage(file.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-amber-600" title="Unstage">
                  <FiMinusCircle size={16} />
                </button>
              ) : (
                <button onClick={() => onStage(file.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600" title="Stage">
                  <FiPlusCircle size={16} />
                </button>
              )}
              <button onClick={() => onEdit(file)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="Edit">
                <FiEdit3 size={16} />
              </button>
              <button onClick={() => onDownload(file)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="Download">
                <FiDownload size={16} />
              </button>
              <button onClick={() => onDelete(file.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500" title="Delete">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
