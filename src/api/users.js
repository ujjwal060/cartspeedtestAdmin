import axios from "./axios";

export const getAllUsers = async (token, offset, limit, sortBy, sortField, filters) => {
    try {
        const response = await axios.post(
            "/admin/user/getAll",
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