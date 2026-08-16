import React from "react";

const ProfileStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Account Overview
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl bg-gray-100 p-5"
            >
              <div className="mb-3 h-4 w-20 rounded bg-gray-200" />
              <div className="h-7 w-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statistics = [
    {
      label: "Posts",
      value: stats?.totalPosts ?? 0,
      icon: "📝",
    },
    {
      label: "Published",
      value: stats?.publishedPosts ?? 0,
      icon: "📢",
    },
    {
      label: "Drafts",
      value: stats?.draftPosts ?? 0,
      icon: "📄",
    },
    {
      label: "Comments",
      value: stats?.totalComments ?? 0,
      icon: "💬",
    },
    {
      label: "Likes",
      value: stats?.totalLikes ?? 0,
      icon: "❤️",
    },
    {
      label: "Views",
      value: stats?.totalViews ?? 0,
      icon: "👁️",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Account Overview
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {statistics.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>

              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {stat.label}
              </span>
            </div>

            <p className="text-2xl font-bold text-gray-800">
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;