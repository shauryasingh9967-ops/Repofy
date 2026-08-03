import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiGitBranch, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-10 sm:py-12">
      <div className="w-full max-w-sm card flex flex-col gap-7 px-6 py-10 sm:px-8 sm:py-11 fade-in">
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent-600 text-white shadow-sm">
            <FiGitBranch size={22} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">Welcome back</h1>
          <p className="text-sm text-gray-400 leading-relaxed">Sign in to your Repofy account</p>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pl-14 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pl-14 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="pt-1 text-right">
            <Link to="/forgot-password" className="text-xs text-accent-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 pt-1">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
