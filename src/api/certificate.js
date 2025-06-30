import axios from "./axios";

export const fetchCertificates = async (
  token,
  filters,
  offset,
  limit,
  sortBy,
  sortField
) => {
  try {
    const response = await axios.post(
      "/admin/cert/getAllCertificate",
      { filters, offset, limit, sortBy, sortField },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching certificates:", error);
  }
};
