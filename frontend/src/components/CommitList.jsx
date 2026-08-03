import React from "react";
import { FiGitCommit, FiRotateCcw } from "react-icons/fi";

const CommitList = ({ commits, onRestore }) => {
  if (commits.length === 0) {
    return <p className="text-sm text-gray-400 py-6 text-center">No commits yet. Stage files and commit to start your history.</p>;
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800" />
      <ul className="space-y-5">
        {commits.map((commit) => (
          <li key={commit.commitId} className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-accent-600 flex items-center justify-center text-white">
              <FiGitCommit size={11} />
            </div>
            <div className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-sm mb-1">{commit.message}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {commit.commitId.slice(0, 7)}
                    </code>
                    <span>{new Date(commit.timestamp).toLocaleString()}</span>
                    <span>· {commit.files.length} file(s)</span>
                  </div>
                </div>
                <button
                  onClick={() => onRestore(commit.commitId)}
                  className="btn-secondary flex items-center gap-1.5 text-xs shrink-0"
                  title="Restore this version"
                >
                  <FiRotateCcw size={13} />
                  Restore
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitList;
