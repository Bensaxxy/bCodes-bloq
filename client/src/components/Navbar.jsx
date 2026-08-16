import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContaxt";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, setUser, setIsLoggedin, backendUrl } = useContext(AppContent);

  const [showMenu, setShowMenu] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedin(false);
      data.success && setUser(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="absolute top-0 left-0 z-50 w-full px-4 py-4 sm:px-6 sm:py-5 lg:px-24">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <h1 className=" text-2xl font-semibold">
          {" "}
          <span className=" text-slate-500">bCodes</span> bloq
        </h1>
        {/* User / Login */}
        {user ? (
          <div className="relative">
            {/* User Avatar */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-700 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-700"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name || "Profile"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                {/* User Info */}
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate font-semibold text-gray-800">
                    {user.name}
                  </p>

                  <p className="truncate text-sm text-gray-500">{user.email}</p>
                </div>

                {/* verify email */}
                {!user.isAccountVerified && (
                  <button
                    onClick={sendVerificationOtp}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    Verify email
                  </button>
                )}

                {/* Profile */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Profile
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-full border border-gray-400 px-5 py-2 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-gray-100 sm:px-6 sm:py-2.5"
          >
            Login
            <img src={assets.arrow_icon} alt="" className="w-4" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
