# Repofy — Custom Version Control System (MongoDB + Auth Edition)

**Live demo:** https://repofy-lovat.vercel.app

A full-stack, web-based, simplified Git-like version control system, built
from scratch — no Git binaries, no Git-emulation libraries. Every user has
their own account and their own strictly private repositories.

## Architecture

```
minigit-mongo/
├── backend/     Express REST API (MVC) + MongoDB/Mongoose + JWT auth
└── frontend/    React 19 + Vite + Tailwind CSS
```

## What's implemented

**Authentication**
- Register / Login (bcrypt-hashed passwords)
- Access token (15 min, kept in memory) + Refresh token (7 days, httpOnly
  cookie) — the frontend silently refreshes the access token on 401s and on
  page load
- Logout, Forgot Password / Reset Password (dev-mode reset link is returned
  directly in the API response since no email service is wired up — see
  `authController.forgotPassword`), Change Password, Update Profile
- Every repository/file/staging/commit/activity route is protected by the
  `protect` middleware **and** the `loadOwnedRepo` middleware, so a user can
  never read or modify another user's data — even by guessing a valid
  MongoDB ObjectId (a foreign repo ID returns 404, not 403, so its existence
  is never revealed either).

**Repositories** — create, rename, delete (cascades to its files/staging/
commits), open, search.

**Files** — create, upload (from local disk, text-based), edit, delete,
download (streamed from the backend with proper `Content-Disposition`).

**Repofy core engine** — initialize repo, stage/unstage individual files,
commit staged files with a message, an auto-generated SHA-256 commit ID
(hash of repo + message + timestamp + parent commit + every staged file's
content — the same conceptual idea as Git's own object hashing), full
chronological commit history, live per-file status (untracked / staged /
modified / committed), and restore any previous commit.

**Search** — across your repositories, and across a repository's commits.

**Dashboard** — repo count, commit count, recent activity feed.

**Settings** — profile update, change password, persisted dark mode.

## 1. MongoDB

You need a MongoDB instance — either local (`mongod` running on
`localhost:27017`) or a free MongoDB Atlas cluster. No manual schema setup
is needed; Mongoose creates collections/indexes automatically on first use.

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET
npm run dev
```

Runs at `http://localhost:5000`.

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api (default is already correct for local dev)
npm run dev
```

Runs at `http://localhost:5173`.

## Notes on scope

This is intentionally **not** a GitHub clone: no branching, merging, pull
requests, remotes, or diff/blame views. The focus is the core snapshot-based
workflow — init → stage → commit → history → restore — implemented
completely and correctly, with real multi-user authentication and data
isolation on top of MongoDB.
