import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContaxt";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import ProfileImageUpload from "../components/ProfileImageUpload";
import { useNavigate } from "react-router-dom";
import { getUserProfileStats } from "../services/userService";
import ProfileStats from "../components/shared/ProfileStats";

const Profile = () => {
  const navigate = useNavigate();

  const { backendUrl, user, setUser, getUserData, setIsLoggedin } =
    useContext(AppContent);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        backendUrl + "/api/user/profile",
        {
          name,
          email,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      const { data } = await axios.delete(backendUrl + "/api/user/profile", {
        withCredentials: true,
      });

      if (data.success) {
        setUser(null);
        setIsLoggedin(false);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        const data = await getUserProfileStats();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error(
          "Get profile stats error:",
          error.response?.data?.message || error.message,
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-purple-400">
        <p className="text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-200 to-purple-400 px-4 py-20">
      <div className="mx-auto w-full max-w-2xl">
        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {/* <span>←</span> */}
              Back
            </button>
          </div>
          {/* Header */}
          <div className="mb-8 text-center">
            <ProfileImageUpload />
            <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account information
            </p>
          </div>

          {/* Profile Information */}
          {!isEditing ? (
            <div className="space-y-5">
              {/* Name */}
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">
                  Full Name
                </p>

                <div className="rounded-lg bg-gray-100 px-4 py-3 text-gray-800">
                  {user.name}
                </div>
              </div>

              {/* Email */}
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">
                  Email Address
                </p>

                <div className="rounded-lg bg-gray-100 px-4 py-3 text-gray-800">
                  {user.email}
                </div>
              </div>

              {/* Account Verification */}
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">
                  Account Status
                </p>

                <div
                  className={`rounded-lg px-4 py-3 font-medium ${
                    user.isAccountVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.isAccountVerified
                    ? "Email Verified"
                    : "Email Not Verified"}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="w-full rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 py-3 font-medium text-white transition hover:opacity-90 mb-6"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Full Name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Email Address"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name || "");
                    setEmail(user.email || "");
                  }}
                  className="flex-1 rounded-full border border-gray-400 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Account Statistics */}
          <ProfileStats stats={stats} loading={statsLoading} />

          {/* Delete Account */}
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="mb-2 font-semibold text-red-600">Delete Account</h2>

            <p className="mb-4 text-sm text-gray-500">
              Deleting your account is permanent and cannot be undone.
            </p>

            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="w-full rounded-full border border-red-500 py-3 font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteLoading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
