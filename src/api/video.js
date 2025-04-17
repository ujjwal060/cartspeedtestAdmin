import axios from "./axios";

export const getVideos = async (formData, token) => {
  try {
    const response = await axios.post("/admin/video/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading videos:", error);
    throw error;
  }
};

export const addVideos = async (formData, token) => {
  try {
    const response = await axios.post("/admin/video/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading videos:", error);
    throw error;
  }
};

export const deleteVideos = async (data) => {
  const response = await axios.post("/admin/video/deleteVideo", data);
  return response.data;
};
