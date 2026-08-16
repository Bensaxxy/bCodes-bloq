import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getPosts = async (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const { data } = await axios.get(
    `${backendUrl}/api/posts?${params.toString()}`,
  );

  return data;
};

export const getPostBySlug = async (slug) => {
  const { data } = await axios.get(`${backendUrl}/api/posts/${slug}`);

  return data;
};

export const getMyPosts = async () => {
  const { data } = await axios.get(`${backendUrl}/api/posts/my-posts`);

  return data;
};

export const createPost = async (postData) => {
  const { data } = await axios.post(`${backendUrl}/api/posts`, postData);

  return data;
};

export const updatePost = async (id, postData) => {
  const { data } = await axios.put(`${backendUrl}/api/posts/${id}`, postData);

  return data;
};

export const deletePost = async (id) => {
  const { data } = await axios.delete(`${backendUrl}/api/posts/${id}`);

  return data;
};

// =============================
// LIKES
// =============================

// Like a post
export const likePost = async (postId) => {
  const { data } = await axios.post(`${backendUrl}/api/posts/${postId}/like`);

  return data;
};

// Unlike a post
export const unlikePost = async (postId) => {
  const { data } = await axios.delete(`${backendUrl}/api/posts/${postId}/like`);

  return data;
};

// Get current user's like status
export const getLikeStatus = async (postId) => {
  const { data } = await axios.get(`${backendUrl}/api/posts/${postId}/like`);

  return data;
};
