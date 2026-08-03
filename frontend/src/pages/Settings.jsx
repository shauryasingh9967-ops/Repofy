import React, { useState } from "react";
import { FiMoon, FiSun, FiUser, FiSave, FiLock } from "react-icons/fi";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { updateProfile, changePassword } from "../services/userService.js";

const Settings = () => {
  const { currentUser, updateUserInPlace } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const [name, setName] = useState(currentUser?.name || "");
  const [profileSaved, setProfileSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateProfile(name);
      updateUserInPlace(res.data);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwSuccess("Password updated successfully");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiUser className="text-accent-600" size={18} />
            <h2 className="font-semibold">Profile</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input value={currentUser?.email || ""} disabled className="input-field opacity-60" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Display Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2">
              <FiSave size={15} /> {savingProfile ? "Saving..." : "Save Changes"}
            </button>
            {profileSaved && <p className="text-sm text-green-600">Profile updated successfully!</p>}
          </form>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            {darkMode ? <FiMoon className="text-accent-600" size={18} /> : <FiSun className="text-accent-600" size={18} />}
            <h2 className="font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Dark Mode</p>
              <p className="text-xs text-gray-400">Switch between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors duration-300 ${
                darkMode ? "bg-accent-600 justify-end" : "bg-gray-300 justify-start"
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <FiLock className="text-accent-600" size={18} />
            <h2 className="font-semibold">Change Password</h2>
          </div>
          {pwError && <p className="mb-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{pwError}</p>}
          {pwSuccess && <p className="mb-3 text-sm text-green-600 bg-green-50 dark:bg-green-950 rounded-lg px-3 py-2">{pwSuccess}</p>}
          <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="password"
              required
              placeholder="Current password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="input-field"
            />
            <input
              type="password"
              required
              placeholder="New password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="input-field"
            />
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              className="input-field"
            />
            <button type="submit" disabled={savingPassword} className="btn-primary sm:col-span-3 sm:w-fit">
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
