import React from "react";
import UserAvatar from "./UserAvatar";
import UserName from "./UserName";

const Author = ({ user, size = "md" }) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} size={size} />

      <UserName user={user} className="text-gray-800" />
    </div>
  );
};

export default Author;
