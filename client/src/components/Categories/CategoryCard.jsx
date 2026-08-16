import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/categories/${category.slug}`)}
      className="cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <h2 className="mb-2 text-xl font-semibold text-slate-900">
        {category.name}
      </h2>

      {category.description && (
        <p className="line-clamp-2 text-sm text-slate-600">
          {category.description}
        </p>
      )}

      {category.postCount !== undefined && (
        <p className="mt-4 text-sm font-medium text-indigo-600">
          {category.postCount}{" "}
          {category.postCount === 1 ? "Post" : "Posts"}
        </p>
      )}
    </div>
  );
};

export default CategoryCard;