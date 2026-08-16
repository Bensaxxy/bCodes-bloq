import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAdminDashboardStats } from "../../services/adminService";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAdminDashboardStats();

      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message || "Failed to load dashboard statistics");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load dashboard statistics",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Unable to load dashboard
        </h2>

        <button
          onClick={() => fetchStats()}
          className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.users?.total || 0,
      description: `${stats.users?.verified || 0} verified`,
      icon: "👥",
      path: "/admin/users",
    },
    {
      title: "Total Posts",
      value: stats.posts?.total || 0,
      description: `${stats.posts?.published || 0} published`,
      icon: "📝",
      path: "/admin/posts",
    },
    {
      title: "Categories",
      value: stats.categories?.total || 0,
      description: `${stats.categories?.active || 0} active`,
      icon: "📂",
      path: "/admin/categories",
    },
    {
      title: "Comments",
      value: stats.comments?.total || 0,
      description: "Total comments",
      icon: "💬",
      path: "/admin/comments",
    },
    {
      title: "Total Likes",
      value: stats.likes?.total || 0,
      description: "Across all posts",
      icon: "❤️",
      path: "/admin/posts",
    },
    {
      title: "Total Views",
      value: stats.views?.total || 0,
      description: "Across all posts",
      icon: "👁️",
      path: "/admin/posts",
    },
    {
      title: "Admins",
      value: stats.users?.admins || 0,
      description: "Administrator accounts",
      icon: "🛡️",
      // path: "/admin/users",
    },
    {
      title: "Draft Posts",
      value: stats.posts?.drafts || 0,
      description: "Unpublished posts",
      icon: "📄",
      path: "/admin/posts",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your blog platform.
          </p>
        </div>

        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Refreshing...
            </>
          ) : (
            <>
              <span>↻</span>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value.toLocaleString()}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {card.description}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Overview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Users Overview
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <OverviewCard title="Total Users" value={stats.users?.total || 0} />

          <OverviewCard
            title="Verified Users"
            value={stats.users?.verified || 0}
          />

          <OverviewCard
            title="Unverified Users"
            value={stats.users?.unverified || 0}
          />
        </div>
      </section>

      {/* Posts Overview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Posts Overview
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <OverviewCard title="Total Posts" value={stats.posts?.total || 0} />

          <OverviewCard title="Published" value={stats.posts?.published || 0} />

          <OverviewCard title="Drafts" value={stats.posts?.drafts || 0} />
        </div>
      </section>

      {/* Categories Overview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Categories Overview
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <OverviewCard
            title="Total Categories"
            value={stats.categories?.total || 0}
          />

          <OverviewCard
            title="Active Categories"
            value={stats.categories?.active || 0}
          />

          <OverviewCard
            title="Inactive Categories"
            value={stats.categories?.inactive || 0}
          />
        </div>
      </section>

      {/* Engagement */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Engagement
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <OverviewCard title="Views" value={stats.views?.total || 0} />

          <OverviewCard title="Likes" value={stats.likes?.total || 0} />

          <OverviewCard title="Comments" value={stats.comments?.total || 0} />
        </div>
      </section>
    </div>
  );
};

const OverviewCard = ({ title, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default AdminDashboard;
