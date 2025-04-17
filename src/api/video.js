import axios from "./axios";

export const getVideos = async (data) => {
  const response = await axios.post("/admin/video/getAll", data);
  return response.data;
};

export const addVideos = async (data) => {
  const response = await axios.post("/admin/video/add", data);
  return response.data;
};

export const deleteVideos = async (data) => {
  const response = await axios.post("/admin/video/deleteVideo", data);
  return response.data;
};