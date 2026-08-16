import React, { useRef, useState, useContext } from "react";
import { toast } from "react-toastify";

import { AppContent } from "../context/AppContaxt";
import {
  updateProfileImage,
  removeProfileImage,
} from "../services/userService";

const ProfileImageUpload = () => {
  const inputRef = useRef();

  const { user, setUser } = useContext(AppContent);

  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const data = await updateProfileImage(file);

      if (data.success) {
        setUser(data.user);

        toast.success("Profile image updated");
      } else {
        toast.error(data.message || "Failed to update profile image");
      }
    } catch (error) {
      console.log("UPLOAD ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message || error.message || "Image upload failed",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile image?",
    );

    if (!confirmed) return;

    try {
      setUploading(true);

      const data = await removeProfileImage();

      if (data.success) {
        setUser(data.user);

        toast.success("Profile image removed");
      } else {
        toast.error(data.message || "Failed to remove profile image");
      }
    } catch (error) {
      console.log("REMOVE IMAGE ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove profile image",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div
        className="relative cursor-pointer"
        onClick={() => !uploading && inputRef.current.click()}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="profile"
            className="h-24 w-24 rounded-full border-2 border-indigo-500 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-indigo-500 bg-gray-700 text-3xl font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <span className="absolute bottom-0 right-0 rounded-full bg-indigo-600 px-2 py-1 text-xs text-white">
          📷
        </span>
      </div>

      {/* File input */}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
      />

      {/* Upload state */}
      {uploading && <p className="mt-2 text-sm text-gray-500">Processing...</p>}

      {/* Remove */}
      {!uploading && user?.profileImage && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="mt-3 text-sm font-medium text-red-500 transition hover:text-red-700"
        >
          Remove image
        </button>
      )}
    </div>
  );
};

export default ProfileImageUpload;
