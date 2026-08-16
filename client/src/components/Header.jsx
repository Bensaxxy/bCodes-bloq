import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContaxt";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className="mt-20 flex flex-col items-center justify-center px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt="header-image"
        className="mb-6 h-36 w-36 rounded-full object-cover"
      />

      <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
        Hey {user ? user.name : "Developer"}!
        <img
          src={assets.hand_wave}
          alt="header-image"
          className="aspect-square w-8"
        />
      </h1>

      <h2 className="mb-3 text-3xl font-medium sm:text-5xl">
        Welcome to bCodes Bloq!
      </h2>

      <p className="mb-8 max-w-md text-gray-600">
        Learn. Build. Share. Explore articles, tutorials, and insights from the
        world of software development.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/categories")}
          className="rounded-full bg-indigo-600 px-8 py-2.5 text-white transition hover:bg-indigo-700"
        >
          Browse Categories
        </button>

        <button
          onClick={() => navigate("/posts")}
          className="rounded-full border border-gray-500 px-8 py-2.5 transition hover:bg-gray-100"
        >
          Explore Posts
        </button>
      </div>
    </div>
  );
};

export default Header;
