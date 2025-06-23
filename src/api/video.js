import axios from "./axios";

export const getVideos = async (
  token,
  offset,
  limit,
  sortBy,
  sortField,
  filters
) => {
  try {
    const response = await axios.post(
      "/admin/video/getAll",
      { offset, limit, sortBy, sortField, filters },
      {
        headers: {
          "Content-Type": "application/json",
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

export const deleteVideos = async (id, token) => {
  const response = await axios.delete(`/admin/video/deleteVideo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const isActiveVideos = async (id, token) => {
  const response = await axios.patch(
    `/admin/video/status/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const isActiveSafetyVideos = async (id, token) => {
  const response = await axios.patch(
    `http://18.209.91.97:9090/api/admin/video/saftyStatus/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const sectionVideos = async (id, number, token, userId) => {
  const response = await axios.post(
    `/admin/video/checkExSection/${userId}`,
    {
      sectionNumber: number,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const addSafetyVideo = async (token, formData) => {
  try {
    const response = await axios.post("/admin/video/addSafityVideo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding safety video:", error);
    throw error;
  }
};

export const getSafetyVideos = async (
  token,
  offset = 0,
  limit = 10,
  sortBy = 1,
  sortField = "createdAt",
  filters
) => {
  try {
    const response = await axios.post(
      "http://18.209.91.97:9090/api/admin/video/getSeftyVideo",
      {
        offset,
        limit,
        sortBy,
        sortField,
        ...filters,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching safety videos:", error);
    throw error;
  }
};

// For safety videos (assuming similar endpoint structure)
export const deleteSafetyVideos = async (videoId, token) => {
  const response = await axios.delete(
    `http://18.209.91.97:9090/api/admin/video/deleteSaftyVideo/${videoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
