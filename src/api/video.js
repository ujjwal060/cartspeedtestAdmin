import axios from "./axios";

export const getVideos = async (token, offset, limit, sortBy,sortField,filters) => {
  try {
    const response = await axios.post(
      "/admin/video/getAll",
      { offset, limit,sortBy,sortField,filters },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

export const deleteVideos = async (id,token) => {
  const response = await axios.delete(`/admin/video/deleteVideo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
