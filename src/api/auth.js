import axios from "./axios";


export const authenticateUser = (token) => {
  return axios.post(
    '/admin/auth/verifyToken', 
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
};

export const refreashToken = (refreshToken) => {
  return axios.post(
    '/admin/auth/refreshToken',
    { refreshToken },
  );
};

export const loginUser = async (credentials) => {
  const response = await axios.post("/admin/login", credentials);
  return response.data;
};

export const forgot = async (data) => {
  const response = await axios.post("/admin/forgote", data);
  return response.data;
};

export const otpVerify = async (data) => {
  const response = await axios.post("/admin/verifyotp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axios.post("/admin/setPass", data);
  return response.data;
};

export const getProfile = async (id, token) => {
  const response = await axios.get(`/admin/profile/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};