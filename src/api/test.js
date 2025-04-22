import axios from "./axios";

export const getQA = async (token, offset, limit, filters) => {
  try {
    const response = await axios.post(
      "/admin/QA/getQA",
      { offset, limit, filters },
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

export const addQA = async (data, token) => {
  try {
    const response = await axios.post("/admin/QA/add", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading videos:", error);
    throw error;
  }
};