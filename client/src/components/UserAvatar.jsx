import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContaxt";

const UserAvatar = ({ user, size = "md", clickable = true }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AppContent);

  if (!user) return null;

  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-xl",
    xl: "h-24 w-24 text-4xl",
  };

  const handleClick = () => {
    if (!clickable) return;

    // If this is the logged-in user
    if (currentUser?._id === user._id) {
      navigate("/profile");
      return;
    }

    // Otherwise go to public profile
    navigate(`/users/${user._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 font-semibold text-white ${
        sizes[size]
      } ${clickable ? "cursor-pointer" : ""}`}
    >
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name}
          className="h-full w-full object-cover"
        />
      ) : (
        user.name?.charAt(0)?.toUpperCase() || "U"
      )}
    </div>
  );
};

export default UserAvatar;
