import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContaxt";
import { toast } from "react-toastify";
import axios from "axios";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { backendUrl, setIsLoggedin, setUser } = useContext(AppContent);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/logout",
      );

      if (data.success) {
        setIsLoggedin(false);
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Logout failed",
      );
    }
  };

  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Posts",
      path: "/admin/posts",
      icon: "📝",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "📂",
    },
    {
      name: "Comments",
      path: "/admin/comments",
      icon: "💬",
    },
  ];

  const handleNavigation = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">

        {/* ========================================= */}
        {/* MOBILE OVERLAY */}
        {/* ========================================= */}

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ========================================= */}
        {/* SIDEBAR */}
        {/* ========================================= */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64
            shrink-0 bg-slate-900 text-white
            transform transition-transform duration-300 ease-in-out
            md:static md:translate-x-0
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-xl font-bold">
                Admin Panel
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Blog Management
              </p>
            </div>

            {/* Close button - mobile only */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3">
            {links.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== "/admin" &&
                  location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleNavigation}
                  className={`
                    mb-1 flex items-center gap-3 rounded-lg
                    px-4 py-3 text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">
                    {link.icon}
                  </span>

                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Sidebar Logout */}
          <div className="absolute bottom-0 w-full border-t border-slate-800 p-4 md:hidden">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* ========================================= */}
        {/* MAIN CONTENT */}
        {/* ========================================= */}

        <main className="min-w-0 flex-1">

          {/* ========================================= */}
          {/* TOP BAR */}
          {/* ========================================= */}

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">

              {/* Left side */}
              <div className="flex items-center gap-3">

                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
                  aria-label="Open sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Admin Panel
                  </h2>

                  <p className="hidden text-xs text-slate-500 sm:block">
                    Manage your blog
                  </p>
                </div>
              </div>

              {/* Desktop logout */}
              <button
                onClick={handleLogout}
                className="hidden rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 md:block"
              >
                Logout
              </button>
            </div>
          </header>

          {/* ========================================= */}
          {/* PAGE CONTENT */}
          {/* ========================================= */}

          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;