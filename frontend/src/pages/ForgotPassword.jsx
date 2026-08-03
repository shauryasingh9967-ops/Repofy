import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiGitBranch, FiMail } from "react-icons/fi";
import { forgotPasswordRequest } from "../services/authService.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevResetUrl("");
    setLoading(true);
    try {
      const res = await forgotPasswordRequest(email);
      setMessage(res.message);
      // No email service is configured in this project, so the backend
      // returns the reset link directly for local development/testing.
      if (res.devResetUrl) setDevResetUrl(res.devResetUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
          <h1 className="text-xl font-bold">Reset your password</h1>
          <p className="text-sm text-gray-400 text-center">We'll help you get back into your account</p>
        </div>

        {message && <p className="mb-3 text-sm text-green-600 bg-green-50 dark:bg-green-950 rounded-lg px-3 py-2">{message}</p>}
        {devResetUrl && (
          <div className="mb-4 text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-lg px-3 py-2 break-all">
            <p className="font-medium mb-1">No email service is configured — dev reset link:</p>
            <Link to={devResetUrl.replace(window.location.origin, "")} className="underline">
              {devResetUrl}
            </Link>
          </div>
        )}
        {error && <p className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Remembered it?{" "}
          <Link to="/login" className="text-accent-600 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
