import axios from "./axios";

export const addGLSVR = async (data) => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication token not found in localStorage');
        }

        const response = await axios.post(
            "/admin/lsv/addGLSVR", 
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding LSV rules:", error);
        throw error;
    }
};

// export const getGLSVR = async (token) => {
//     try {
//         const response = await axios.get(
//             "/admin/lsv/getGLSVR",
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching LSV rules:", error);
//         throw error;
//     }
// };