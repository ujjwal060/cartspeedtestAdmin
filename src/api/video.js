import axios from "./axios";

export const addVideos = async (data) => {
  const response = await axios.post("/admin/forgote", data);
  return response.data;
};