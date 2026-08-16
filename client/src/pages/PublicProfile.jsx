import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProfile } from "../services/userService";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const data = await getPublicProfile(userId);

        if (data.success) {
          setProfile(data);
        }
      } catch (error) {
        console.error(
          "Get public profile error:",
          error.response?.data?.message || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="mb-4 text-gray-600">User not found</p>

        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-indigo-600 px-5 py-2 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const user = profile.user;
  const stats = profile.stats;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Profile Header */}
          <div className="text-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="mx-auto h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-indigo-600 text-4xl font-semibold text-white">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              {user.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {stats?.totalPosts ?? 0}
              </p>

              <p className="text-sm text-gray-500">Posts</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {stats?.publishedPosts ?? 0}
              </p>

              <p className="text-sm text-gray-500">Published Posts</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {stats?.draftPosts ?? 0}
              </p>

              <p className="text-sm text-gray-500">Draft Posts</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {stats?.totalLikes ?? 0}
              </p>

              <p className="text-sm text-gray-500">Likes</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {stats?.totalComments ?? 0}
              </p>

              <p className="text-sm text-gray-500">Total Comments</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {stats?.totalViews ?? 0}
              </p>

              <p className="text-sm text-gray-500">Views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
