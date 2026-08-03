import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiGitBranch, FiLock } from "react-icons/fi";
import { resetPasswordRequest } from "../services/authService.js";
import { setAccessToken } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { updateUserInPlace } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordRequest(token, password);
      setAccessToken(res.data.accessToken);
      updateUserInPlace(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm card p-8 fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-600 flex items-center justify-center text-white mb-3">
            <FiGitBranch size={22} />
          </div>
          <h1 className="text-xl font-bold">Set a new password</h1>
          <p className="text-sm text-gray-400 text-center">Choose a strong new password for your account</p>
        </div>

        {error && <p className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              required
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          <Link to="/login" className="text-accent-600 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
