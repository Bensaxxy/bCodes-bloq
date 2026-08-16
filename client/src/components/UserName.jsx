import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContaxt";

const UserName = ({
  user,
  className = "",
  clickable = true,
}) => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AppContent);

  if (!user) return null;

  const handleClick = () => {
    if (!clickable) return;

    if (currentUser?._id === user._id) {
      navigate("/profile");
      return;
    }

    navigate(`/users/${user._id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`font-medium hover:underline cursor-pointer ${className}`}
    >
      {user.name}
    </button>
  );
};

export default UserName;