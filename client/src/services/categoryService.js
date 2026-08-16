import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getCategories = async () => {
  const { data } = await axios.get(`${backendUrl}/api/categories`);

  return data;
};

export const getCategoryBySlug = async (slug) => {
  const { data } = await axios.get(`${backendUrl}/api/categories/${slug}`);

  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await axios.post(
    `${backendUrl}/api/categories`,
    categoryData,
  );

  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await axios.put(
    `${backendUrl}/api/categories/${id}`,
    categoryData,
  );

  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await axios.delete(`${backendUrl}/api/categories/${id}`);

  return data;
};
