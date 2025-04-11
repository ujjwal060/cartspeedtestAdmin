import axios from "./axios";

export const loginUser = async (credentials) => {
  const response = await axios.post("/admin/login", credentials);
  return response.data;
};