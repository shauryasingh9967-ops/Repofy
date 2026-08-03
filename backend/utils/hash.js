import crypto from "crypto";

/**
 * Generates a Git-like commit hash (SHA-256) derived from the repository,
 * the commit message, the timestamp, the parent commit, and the exact
 * content of every staged file — so the identifier is unique to that
 * specific combination of content and context, the same conceptual
 * principle Git uses for its own object hashes.
 */
export const generateCommitId = ({ repoId, message, timestamp, parentCommitId, files }) => {
  const contentString =
    String(repoId) +
    message +
    timestamp +
    (parentCommitId || "root") +
    files.map((f) => f.fileName + f.content).join("|");

  return crypto.createHash("sha256").update(contentString).digest("hex");
};

export const hashToken = (rawToken) => crypto.createHash("sha256").update(rawToken).digest("hex");
