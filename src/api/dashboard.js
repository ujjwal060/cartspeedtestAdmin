import axios from "./axios";

export const getAll = async (token) => {
  try {
    const response = await axios.get(
      "/admin/dashData/getAll",
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