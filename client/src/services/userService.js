import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const updateProfileImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  const { data } = await axios.put(
    `${backendUrl}/api/user/profile/image`,
    formData,
    {
      withCredentials: true,

      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    },
  );

  return data;
};

export const removeProfileImage = async () => {
  const { data } = await axios.delete(`${backendUrl}/api/user/profile/image`, {
    withCredentials: true,
  });

  return data;
};

export const getUserProfileStats = async () => {
  const { data } = await axios.get(`${backendUrl}/api/user/profile/stats`, {
    withCredentials: true,
  });

  return data;
};

export const getPublicProfile = async (userId) => {
  const { data } = await axios.get(
    `${backendUrl}/api/user/${userId}`,
  );

  return data;
};