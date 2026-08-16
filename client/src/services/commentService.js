import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Get all comments for a post
export const getCommentsByPost = async (postId) => {
  const { data } = await axios.get(`${backendUrl}/api/comments/${postId}`);

  return data;
};

// Create comment OR reply
export const createComment = async (postId, commentData) => {
  const { data } = await axios.post(`${backendUrl}/api/comments/${postId}`, {
    post: postId,
    ...commentData,
  });

  return data;
};

// Update a comment
export const updateComment = async (id, commentData) => {
  const { data } = await axios.put(
    `${backendUrl}/api/comments/${id}`,
    commentData,
  );

  return data;
};

// Delete a comment
export const deleteComment = async (id) => {
  const { data } = await axios.delete(`${backendUrl}/api/comments/${id}`);

  return data;
};
